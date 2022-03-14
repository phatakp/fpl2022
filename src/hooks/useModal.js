import { useState } from "react";
import { Modal } from "react-bootstrap";

export function useModal(Component, title, initialMode = false) {
  const [show, setShow] = useState(initialMode);

  const modal = (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          background: `url(${process.env.REACT_APP_STATIC_URL}/scheduleBg.jpg) no-repeat center center/cover`,
        }}
      >
        {Component}
      </Modal.Body>
    </Modal>
  );

  return { show, setShow, modal };
}
