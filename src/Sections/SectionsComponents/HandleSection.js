export const HandleSections = async (openChapterId, chapterId, setOpenChapterId, setSectionsList, api, _id) => {
    try {
        console.log("HandleSections ----- chapterId:", chapterId);
        console.log("Current openChapterId:", openChapterId);

        if (openChapterId === chapterId) {
            setOpenChapterId(null); // close
            setSectionsList([]); // clear
            return;
        }
        
        const url = `/subjects/${_id}/chapters/${chapterId}/sections`;
        console.log("Making API call to:", url);
        
        const res = await api.get(url);
        console.log("API Response - sections for chapterId", chapterId, ":", res?.data?.sections);
        setSectionsList(res?.data?.sections || []);
        setOpenChapterId(chapterId);
    } catch (e) {
        console.log("error in sections: ", e?.response?.data);
    }
};