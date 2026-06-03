local _M = {}
local resty_lock = require("resty.lock")

function _M.execute_with_lock(key_name)
    -- Initialize lock pointing to the shared dict container
    local lock, err = resty_lock:new("my_locks", {
        exptime = 5,  -- Max time lock is held (seconds)
        timeout = 2,  -- Max time other requests wait for lock (seconds)
    })

    if not lock then
        return { status = "error", message = "failed to create lock: " .. tostring(err) }
    end

    -- Try to acquire the lock
    local elapsed, acquire_err = lock:lock(key_name)
    if not elapsed then
        return { status = "wait_timeout", message = "another request is processing this key: " .. tostring(acquire_err) }
    end

    -- --- CRITICAL SECTION START ---
    -- Simulate a slow execution (e.g., heavy DB query or external API call)
	-- 模拟耗时
    ngx.sleep(0.5)
    -- --- CRITICAL SECTION END ---

    -- Always release the lock when done
    local ok, release_err = lock:unlock()
    if not ok then
        ngx.log(ngx.ERR, "failed to unlock: ", release_err)
    end

    return { status = "success", message = "Lock acquired and released safely.", held_time = elapsed }
end

return _M
