import { Col, Row } from 'antd'
import React from 'react'
import "./clientsManager.css"
function ClientsManager() {
    return (
        <React.Fragment>
            <section className='clients-manager-container'>
                <Row gutter={[16, 16]}>
                    <Col
                        className='clients-manager-col'
                        xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}
                    >
                        <h1>Clientes</h1>
                    </Col>

                    <Col
                        className='clients-manager-col'
                        xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}
                    >
                        <h1>Añadir un cliente</h1>
                    </Col>
                </Row>
            </section>
        </React.Fragment>
    )
}

export default ClientsManager