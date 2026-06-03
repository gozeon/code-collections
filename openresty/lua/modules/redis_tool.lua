local _M = {}
local redis = require("resty.redis")

function _M.get_cache_value(key)
    local red = redis:new()
    red:set_timeouts(1000, 1000, 1000) -- Connect, read, write timeouts (ms)

    -- Connect to Redis (Change host/port to match your setup)
    local ok, err = red:connect("172.17.0.1", 6379)
    if not ok then
        return { success = false, error = "failed to connect: " .. err }
    end

    -- Optional: Authenticate if password is set
    -- local res, err = red:auth("your_password")

    -- Execute a command
    local res, get_err = red:get(key)
    if not res then
        return { success = false, error = "failed to get key: " .. get_err }
    end

    -- Handle null responses safely
    if res == ngx.null then
        res = nil
    end

    -- PUT CONNECTION BACK TO THE POOL (Crucial for performance)
    -- Max idle time: 10 seconds, Pool size: 100 connections
    local pool_ok, pool_err = red:set_keepalive(10000, 100)
    if not pool_ok then
        ngx.log(ngx.ERR, "failed to set keepalive: ", pool_err)
    end

    return { success = true, value = res or "key_does_not_exist" }
end

return _M
