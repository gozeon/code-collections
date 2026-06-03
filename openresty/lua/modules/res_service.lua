local _M = {}
local cjson = require("cjson")

-- Set standard headers and status codes cleanly
function _M.send_json(status_code, payload)
    -- Set explicit response headers
    ngx.status = status_code
    ngx.header.content_type = "application/json; charset=utf-8"
    ngx.header["X-Processed-By"] = "OpenResty-Response-Module"

    -- Convert payload to string and send
    local success, json_str = pcall(cjson.encode, payload)
    if not success then
        ngx.status = ngx.HTTP_INTERNAL_SERVER_ERROR
        ngx.say([[{"error": "Failed to serialize response payload"}]])
        return ngx.exit(ngx.HTTP_OK)
    end

    ngx.say(json_str)
    -- Gracefully stop current execution and flush buffer
    return ngx.exit(ngx.HTTP_OK)
end

return _M
