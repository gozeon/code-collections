local _M = {}
-- Always use the official non-blocking driver
local mysql = require("resty.mysql")

function _M.query_db(sql_statement)
    local db, err = mysql:new()
    if not db then
        return nil, "failed to instantiate mysql: " .. tostring(err)
    end

    -- 1. Set tight network timeouts (Connect, Send, Read in milliseconds)
    db:set_timeouts(1000, 2000, 3000)

    -- 2. Establish non-blocking connection
    local ok, conn_err = db:connect({
        host = "172.17.0.1",
        port = 3306,
        database = "my_app_db",
        user = "root",
        password = "secret_password",
        max_packet_size = 1024 * 1024 -- 1MB max payload row return boundary
    })

    if not ok then
        return nil, "failed to connect to mysql: " .. tostring(conn_err)
    end

    -- 3. Execute the SQL statement asynchronously
    local res, query_err, errcode, sqlstate = db:query(sql_statement)
    if not res then
        db:close() -- Instantly terminate broken sockets
        return nil, "bad query: " .. tostring(query_err) .. " (Code: " .. tostring(errcode) .. ")"
    end

    -- 🌟 4. PREVENT SLOWDOWNS: Put the socket directly back into Nginx's connection pool
    -- Params: max_idle_timeout (10000ms = 10s idle max), pool_size (50 idle connections per worker)
    local keep_ok, keep_err = db:set_keepalive(10000, 50)
    if not keep_ok then
        ngx.log(ngx.ERR, "failed to pool mysql connection: ", keep_err)
        db:close() -- Fallback safety
    end

    -- Return the clean row dataset arrays
    return res, nil
end

return _M
