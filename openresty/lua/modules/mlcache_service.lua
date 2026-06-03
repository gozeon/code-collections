local _M = {}
local cache_instance = nil
local mlcache = require("resty.mlcache")
local redis = require("resty.redis")

local REDIS_HOST = "127.0.0.1"
local REDIS_PORT = 26174
local REDIS_PASS = "" -- 你的 Redis 密码，若无密码设为 nil 或 ""
local REDIS_DB   = 36

-- =========================================================================
-- [私有私有函数] L3 回调：真正去读 Redis
-- =========================================================================
local function fetch_from_redis(key)
    local red = redis:new()
    red:set_timeouts(1000, 1000, 1000)

    local ok, err = red:connect(REDIS_HOST, REDIS_PORT)
    if not ok then
        return nil, "Redis 连接失败: " .. tostring(err)
    end

	if REDIS_PASS and REDIS_PASS ~= "" then
        local res, auth_err = red:auth(REDIS_PASS)
        if not res then
            return nil, "Redis 密码认证失败: " .. tostring(auth_err)
        end
    end

	if REDIS_DB and REDIS_DB > 0 then
        local res, select_err = red:select(REDIS_DB)
        if not res then
            return nil, "Redis 切换 DB " .. REDIS_DB .. " 失败: " .. tostring(select_err)
        end
    end

    local res, read_err = red:get(key)
    if read_err then
        return nil, "Redis 读取失败: " .. tostring(read_err)
    end

    if res == ngx.null then
        return ngx.null, nil -- 触发负缓存机制，防缓存穿透
    end

    -- 连接放回连接池
    red:set_keepalive(10000, 10)
    return res, nil
end

local function init_cache()
    if cache_instance then return cache_instance end

    local err
    -- 注意：这里的 "mlcache_cache" 是专属命名空间
    cache_instance, err = mlcache.new("mlcache_cache", "my_mlcache_dict", {})

    if not cache_instance then
        ngx.log(ngx.ERR, "缓存初始化失败: ", err)
        return nil
    end

    return cache_instance
end

function _M.get_value(key)
    if not key or key == "" then
        return nil, "invalid key"
    end

    local cache = init_cache()
    if not cache then
        return nil, "cache layer uninitialized"
    end

    local cache_key = "k:" .. key

    -- 一键调起固定缓存逻辑：
    -- 自动检索 L1/L2 -> 自动 Singleflight 排队 -> 自动执行内部的 fetch_from_redis -> 自动容错降级
    local value, err = cache:get(cache_key, nil, fetch_from_redis, key)

    if err then
        ngx.log(ngx.ERR, "获取 ", key, " 失败: ", err)
        return nil, err
    end

    return value
end

return _M
