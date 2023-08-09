import { Container } from "react-bootstrap"
import LogoNasa from "../assets/Logos/NASA_logo.svg"
import styles from "./MainContent.module.scss"
import Gallery from "./Gallery/Gallery"

const MainContent = () => {
    return (
        <>
            <section>
                <Container className={styles.pageSection}>
                    <h1>Mars Rover App</h1>
                    <img src={LogoNasa} width={200} />
                </Container>
                <Container className={styles.galleryContainer}>
                    <Gallery />
                </Container>
            </section>
        </>
    )
}

export default MainContent
