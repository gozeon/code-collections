local _M = {}

-- Fetch the shared memory dictionary declared in nginx config
local cache = ngx.shared.my_cache_pool

function _M.handle_counter(key)
    if not cache then
        return { error = "Shared memory pool 'my_cache_pool' not declared in nginx.conf" }
    end

    -- Try to fetch the current value
    local current_val, flags = cache:get(key)

    if not current_val then
        -- If it doesn't exist, initialize it with an expiration time of 60 seconds
        cache:set(key, 1, 60)
        current_val = 1
    else
        -- Increment atomically to prevent race conditions
        current_val = cache:incr(key, 1)
    end

    return {
        key = key,
        visit_count = current_val,
        message = "This counter resets after 60 seconds of inactivity."
    }
end

return _M
