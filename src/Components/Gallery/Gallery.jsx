import { useState, useEffect } from "react"
import ReactSelect from "react-select"
import { Container, Button, Spinner, Form } from "react-bootstrap"
import RangeSlider from "react-bootstrap-range-slider"
import styles from "./Gallery.module.scss"
import getRoverImages from "../../api/nasaApi.js"
import { motion } from "framer-motion" // Importa Framer Motion

const Gallery = () => {
    const [selectedRover, setSelectedRover] = useState("curiosity")
    const [selectedCamera, setSelectedCamera] = useState("ALL")
    const [selectedSol, setSelectedSol] = useState(1)
    const [images, setImages] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [noImagesMessage, setNoImagesMessage] = useState("")
    const [earthDaySelected, setEarthDaySelected] = useState(false)
    const [solSelected, setSolSelected] = useState(false)

    const IMAGES_PER_PAGE = 25

    const roverOptions = [
        { value: "curiosity", label: "Curiosity" },
        { value: "opportunity", label: "Opportunity" },
        { value: "spirit", label: "Spirit" },
    ]

    const cameraOptions = [
        { value: "ALL", label: "Todas las cámaras" },
        { value: "FHAZ", label: "Front Hazard Avoidance Camera" },
        { value: "RHAZ", label: "Rear Hazard Avoidance Camera" },
        { value: "MAST", label: "Mast Camera" },
        { value: "CHEMCAM", label: "Chemistry and Camera Complex" },
        { value: "MAHLI", label: "Mars Hand Lens Imager" },
        { value: "MARDI", label: "Mars Descent Imager" },
        { value: "NAVCAM", label: "Navigation Camera" },
        { value: "PANCAM", label: "Panoramic Camera" },
        { value: "MINITES", label: "Miniature Thermal Emission Spectrometer " },
    ]

    const handleLoadMore = async () => {
        const nextPage = currentPage + 1
        try {
            setLoading(true)
            const roverImages = await getRoverImages(
                selectedRover,
                nextPage,
                selectedCamera,
                selectedSol
            )
            setImages((prevImages) => [...prevImages, ...roverImages])
            setCurrentPage(nextPage)
            setLoading(false)
        } catch (error) {
            console.error("Error:", error.message)
            setLoading(false)
        }
    }

    const handleSolIncrement = () => {
        setSelectedSol((prevSol) => prevSol + 1)
        if (solSelected && selectedSol + 1 !== 2890) {
            setSolSelected(false)
        }
    }

    const handleSolDecrement = () => {
        setSelectedSol((prevSol) => prevSol - 1)
        if (solSelected && selectedSol - 1 !== 2890) {
            setSolSelected(false)
        }
    }

    const handleSliderChange = (e) => {
        const newSolValue = parseInt(e.target.value)
        setSelectedSol(newSolValue)
        if (solSelected && newSolValue !== 2890) {
            setSolSelected(false)
        }
    }

    const handleSolCheckboxChange = () => {
        if (!solSelected) {
            setSelectedSol(2890)
        }
        setSolSelected(!solSelected)
    }

    const loadImages = async (roverName, page, camera, sol) => {
        if (!roverName) return

        try {
            setLoading(true)
            const startIndex = (page - 1) * IMAGES_PER_PAGE
            const roverImages = await getRoverImages(
                roverName,
                startIndex,
                camera,
                sol
            )

            setImages(roverImages)
            setLoading(false)
        } catch (error) {
            console.error("Error:", error.message)
            setLoading(false)
        }
    }

    useEffect(() => {
        setImages([])
        setCurrentPage(1)
        setNoImagesMessage("")

        const solValue = solSelected ? 2890 : selectedSol
        loadImages(selectedRover, 1, selectedCamera, solValue)
    }, [selectedRover, selectedCamera, selectedSol, solSelected])

    return (
        <>
            <Container className={styles.selectsContainer}>
                <ReactSelect
                    options={roverOptions}
                    onChange={(selectedOption) =>
                        setSelectedRover(selectedOption.value)
                    }
                    defaultValue={roverOptions[0]}
                    placeholder="Seleccione un rover"
                />
                <ReactSelect
                    options={cameraOptions}
                    onChange={(selectedOption) =>
                        setSelectedCamera(selectedOption.value)
                    }
                    defaultValue={cameraOptions[0]}
                    placeholder="Seleccione una cámara"
                />
            </Container>
            <Container className={styles.rangeContainer}>
                <h3>Sol Date: {solSelected ? 2890 : selectedSol}</h3>
                <motion.div
                    className={styles.slider}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <RangeSlider
                        value={selectedSol}
                        onChange={handleSliderChange}
                        min={0}
                        max={3000}
                        step={1}
                        disabled={solSelected}
                    />
                </motion.div>
            </Container>
            <Container>
                <Button
                    variant="primary"
                    onClick={handleSolDecrement}
                    disabled={solSelected}
                >
                    -
                </Button>{" "}
                <Button
                    variant="primary"
                    onClick={handleSolIncrement}
                    disabled={solSelected}
                >
                    +
                </Button>
            </Container>
            <Container className={styles.counter}>
                <Form.Check
                    type="checkbox"
                    label="Buscar por 'Sol' date (2890)"
                    checked={solSelected}
                    onChange={handleSolCheckboxChange}
                />
            </Container>
            <Container className={styles.galleryContainer}>
                <Container className={styles.imageGallery}>
                    {images.length === 0 && !loading && (
                        <p className={styles.noImagesMessage}>
                            {noImagesMessage || "No existen imágenes"}
                        </p>
                    )}
                    {images.map((image, index) => (
                        <img
                            width={200}
                            key={index}
                            src={image}
                            alt={`Imagen ${index}`}
                            className={styles.image}
                        />
                    ))}
                    {loading ? (
                        <Container>
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">
                                    Loading...
                                </span>
                            </Spinner>
                        </Container>
                    ) : (
                        images.length >= IMAGES_PER_PAGE && (
                            <Container className="mt-4">
                                <Button
                                    className={styles.loadingButton}
                                    onClick={handleLoadMore}
                                    disabled={loading}
                                >
                                    Load more
                                </Button>
                            </Container>
                        )
                    )}
                </Container>
            </Container>
        </>
    )
}

export default Gallery
