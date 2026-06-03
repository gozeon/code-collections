local _M = {}
-- Import the standard rate limiting module (usually pre-bundled)
local limit_req = require("resty.limit.req")

function _M.check_rate(client_key)
	local key = client_key or ngx.var.binary_remote_addr;

    -- Initialize the rate limiter pointing to our shared dict
    -- Allow 200 r/s , with an allowable burst of 50
    local lim, err = limit_req.new("my_limit_req_store", 200, 50)
    if not lim then
		ngx.log(ngx.ERR, "failed to new limit:", err)
        return true -- Fail open or log error
    end

    -- Increment counter for this specific client IP or Token
    local delay, err = lim:incoming(key, true)

    if not delay then
        if err == "rejected" then
            ngx.status = 429 -- Service Unavailable / Too Many Requests
            ngx.say([[{"error": "Rate limit exceeded"}]])
            return ngx.exit(ngx.HTTP_OK)
        end
        ngx.log(ngx.ERR, "failed to limit req: ", err)
        return true
    end

    -- If delay > 0, the request is within burst limits but needs to be slowed down
    if delay >= 0.001 then
        ngx.sleep(delay)
    end

	return true
end

return _M
