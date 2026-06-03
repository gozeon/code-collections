local _M = {}
local cjson = require("cjson")

-- A mock user database (In production, replace this with a Redis lookup or JWT decode)
local VALID_TOKENS = {
    ["secret-token-123"] = { user_id = 1001, role = "admin", name = "Alex" },
    ["user-token-abc"]   = { user_id = 1002, role = "user",  name = "Emily" }
}

function _M.authenticate()
    -- Extract the Authorization header
    local headers = ngx.req.get_headers()
    local auth_header = headers["authorization"]

    if not auth_header then
        return _M.abort_unauthorized("Missing Authorization header")
    end

    -- Parse the 'Bearer <token>' format using regex
    -- "jo" flag optimizes performance via PCRE JIT caching
    local matches, err = ngx.re.match(auth_header, [[Bearer\s+(.+)]], "jo")
    if not matches then
        return _M.abort_unauthorized("Invalid Authorization header format. Use 'Bearer <token>'")
    end

    local token = matches[1]

    -- Validate the token against our data store
    local user_profile = VALID_TOKENS[token]
    if not user_profile then
        return _M.abort_unauthorized("Invalid or expired authentication token")
    end

    -- 🌟 SUCCESS: Store user context in ngx.ctx
    -- ngx.ctx is unique to the current HTTP request and shared across all modules
    ngx.ctx.user = user_profile

    -- Inject user identity into downstream proxy headers just in case
    ngx.req.set_header("X-User-Id", tostring(user_profile.user_id))
    ngx.req.set_header("X-User-Role", user_profile.role)
end

-- Helper function to abort requests cleanly with an HTTP 401
function _M.abort_unauthorized(message)
    ngx.status = ngx.HTTP_UNAUTHORIZED -- HTTP 401
    ngx.header.content_type = "application/json; charset=utf-8"
    ngx.header["WWW-Authenticate"] = 'Bearer realm="API Access"'

    ngx.say(cjson.encode({
        error = "Unauthorized",
        message = message
    }))

    -- Terminates the current request lifecycle immediately
    return ngx.exit(ngx.HTTP_OK)
end

return _M
