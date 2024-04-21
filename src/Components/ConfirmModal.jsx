import PropTypes from "prop-types";

const ConfirmModal = ({ isOpen, onClose, onSubmit, title }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
        onClose();
    };

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">
                                {title}
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="flex justify-end">
                                <button
                                    onClick={onClose}
                                    className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-red-500 text-white rounded-lg px-4 py-2 ml-3 hover:bg-red-600"
                                >
                                    Confirm
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

ConfirmModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired
}

export default ConfirmModal;