export const WrapAsync = (func, setMsg, setMsgType) => {
    return async function (...arg) {
        try {
            const res = await func(...arg)
            if ((res?.data?.message || res?.data?.msg) && setMsg) setMsg(res?.data?.message || res?.data?.msg)
            if (setMsgType) setMsgType("success")
            return res;
        } catch (e) {
            console.log("front error: ", e?.response?.data || e?.message)
            if (setMsg) setMsg(e?.response?.data?.message || e?.response?.data?.msg || e?.message || "Something Went Wrong")
            if (setMsgType) setMsgType("danger")
            throw e;
        }
    }
}
