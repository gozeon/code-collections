local _M = {}
local http = require("resty.http")

function _M.fetch_external_api(url)
    local httpc = http.new()

    httpc:set_timeout(500) -- 500ms
    local res, err = httpc:request_uri(url, {
        method = "GET",
        headers = {
            ["Accept"] = "application/json",
        },
        ssl_verify = false -- Set to true in production for HTTPS validation
    })

    if not res then
        return { success = false, error = err }
    end

    return {
        success = true,
        status = res.status,
        body = res.body
    }
end

return _M
