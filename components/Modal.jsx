import ReactModal from "react-modal";

function Modal({ children, isOpen = false, setIsOpen, onClose }) {
  return (
    <ReactModal
      style={{
        overlay: {
          zIndex: 10,
        },
      }}
      className="outline-none transition-opacity relative bg-white rounded overflow-hidden shadow-lg p-8 mb-10 w-2/3 mx-auto transform -translate-y-1/2 top-1/2"
      isOpen={isOpen}
      onRequestClose={() => {
        setIsOpen(false);
        onClose();
      }}
    >
      {children}
    </ReactModal>
  );
}

export default Modal;
