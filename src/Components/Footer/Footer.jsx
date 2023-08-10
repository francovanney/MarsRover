import { Container } from "react-bootstrap"
import styles from "./Footer.module.scss"

const Footer = () => {
    return (
        <Container className={styles.footer}>
            <h6>
                Developed by
                <a
                    href="https://francovanneydev.com.ar/"
                    target="_blank"
                    rel="noreferrer"
                    className={styles.link}
                >
                    wwww.francovanneydev.com.ar
                </a>
                - 2023
            </h6>
        </Container>
    )
}

export default Footer
