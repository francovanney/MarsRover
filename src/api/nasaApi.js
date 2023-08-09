import axios from "axios"

const API_KEY = "7x1bqlbhmvPMdEeyX1zn1WL875vD8zl3O9Vjs3jg"

const nasaApi = axios.create({
    baseURL: "https://api.nasa.gov/mars-photos/api/v1",
})

//GET PHOTOS

export default async function getRoverImages(
    roverName,
    page = 1,
    camera = "ALL",
    sol
) {
    let endpoint = `/rovers/${roverName}/photos?sol=${sol}&page=${page}&api_key=${API_KEY}`

    if (camera !== "ALL") {
        endpoint += `&camera=${camera}`
    }

    endpoint += `&order=desc&orderby=earth_date`

    try {
        const response = await nasaApi.get(endpoint)
        const roverImages = response.data.photos
        console.log(roverImages)
        console.log("selected ROVER --->" + roverName)
        console.log(
            "selected CAMERA --->" + response.data.photos[0].camera.name
        )
        console.log("selected SOL --->" + response.data.photos[0].sol)
        return roverImages.map((photo) => photo.img_src)
    } catch (error) {
        throw new Error(
            "Error al obtener las imágenes del rover: " + error.message
        )
    }
}
