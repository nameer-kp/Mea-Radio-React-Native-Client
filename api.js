
const host = '10.0.2.2';
const mainPort = "3000"
const mongoPort = "8000"

//Login
export const logInApi =`http://${host}:${mainPort}/api/app/login`

//Shows
export const getShowsApi = `http://${host}:${mongoPort}/api/app/shows`
export const getAudioApi = `http://${host}:${mongoPort}/api/app/shows/audio/`
export const getThumbnailApi = `http://${host}:${mongoPort}/api/app/shows/thumbnail/`

//Upcoming Shows
export const getUpcomingShowsApi = `http://${host}:${mainPort}/api/app/upcoming_shows`
//Book Slot
export const bookSlotApi = `http://${host}:${mongoPort}/api/app/bookslot`
//My Shows
export const getMyShowsApi = `http://${host}:${mainPort}/api/app/my_shows`

//Like Show
export const likeShowApi = `http://${host}:${mongoPort}/api/app/shows/like`