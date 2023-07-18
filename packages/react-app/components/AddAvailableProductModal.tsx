// This component is used to add a product to the marketplace and show the user's cUSD balance

// Importing the dependencies
import { useState } from "react";
// Import the toast library to display notifications
import { toast } from "react-toastify";
// Import the useDebounce hook to debounce the input fields
import { useDebounce } from "use-debounce";
// Import our custom useContractSend hook to write a product to the marketplace contract
import { useContractSend } from "@/hooks/contracts/useContractWrite";


// Define the AddProductModal component
const AddAvailableProductModal = ({id}:any) => {
  // The visible state is used to toggle the visibility of the modal
  const [visible, setVisible] = useState(false);
  // The following states are used to store the values of the input fields
  const [productQuantity, setAddition] = useState<string | number>(0);

  // The following states are used to debounce the input fields
  const [debouncedAddition] = useDebounce(productQuantity, 500);
  const [loading, setLoading] = useState("");

  // Check if all the input fields are filled
   const isComplete = () => {
    const numericQuantity = parseFloat(productQuantity);
    if (!productQuantity || isNaN(numericQuantity) || numericQuantity < 1) {
      const numericQuantity = parseFloat(productQuantity);
      toast.warn("Please enter a valid number (> 0)")
      return false;
    }
    return true
  }

  // Clear the input fields after the availability has been increased.
  const clearForm = () => {
    setAddition(0);
 
  };


  // Use the useContractSend hook to use our increaseProductAvailability function on the marketplace contract and add a product to the marketplace
  const { writeAsync: addMoreProduct } = useContractSend("increaseProductAvailability", [
    id,
    debouncedAddition
  ]);

 const addAvailable = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    if (!isComplete()) {
      throw new Error("Please fill all fields");
    }

    await toast.promise(
      async () => {
        if (!addMoreProduct) {
          throw new Error("Failed to add product");
        }
        setLoading("Adding...");
        const tx = await addMoreProduct();
        setLoading("Waiting...");
        await tx.wait();
      },
      {
        pending: "Increasing availability of your products...",
        success: "Products added successfully",
        error: {
          render({ data }) {
            throw new Error(data?.message || "Something went wrong. Try again.");
          }
      }
    );
  } catch (error: any) {
    console.log(error);
    toast.error(error?.message || "Something went wrong. Try again.");
  } finally {
    setLoading("");
    setVisible(false);
    clearForm();
  }
};



 

 

 
  // Define the JSX that will be rendered
  return (
    <div className={"flex flex-row w-full justify-between"}>
      <div>
        {/* Add Product Button that opens the modal */}
        <button
          type="button"
          onClick={() => setVisible(true)}
          className="inline-block ml-4 px-6 py-2.5 bg-black text-white font-medium text-md leading-tight rounded-2xl shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          data-bs-toggle="modal"
          data-bs-target="#exampleModalCenter"
        >
          Increase Availability
        </button>

        {/* Modal */}
        {visible && (
          <div
            className="fixed z-40 overflow-y-auto top-0 w-full left-0"
            id="modal"
          >
            {/* Form with input field for increasing the availability of the product  */}
            <form onSubmit={addAvailable}>
              <div className="flex items-center justify-center min-height-100vh pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity">
                  <div className="absolute inset-0 bg-gray-900 opacity-75" />
                </div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
                  &#8203;
                </span>
                <div
                  className="inline-block align-center bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="modal-headline"
                >
                  {/* Input fields for the product */}
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">

                    <label>Number of products</label>
                    <input
                      onChange={(e) => {
                        setAddition(e.target.value);
                      }}
                      required
                      type="number"
                      min="1"
                      className="w-full bg-gray-100 p-2 mt-2 mb-3"
                    />
                    <div className="invalid-feedback">
                      Please enter a valid number.
                  </div>
                  </div>
                  {/* Button to close the modal */}
                  <div className="bg-gray-200 px-4 py-3 text-right">
                    <button
                      type="button"
                      className="py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-700 mr-2"
                      onClick={() => setVisible(false)}
                    >
                      <i className="fas fa-times"></i> Cancel
                    </button>
                    {/* Button to add the product to the marketplace */}
                    <button
                      type="submit"
                      disabled={!!loading || !addAvailable}
                      className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700 mr-2 disabled:bg-blue-300 disabled:hover:bg-blue-300"
                    >
                      {loading ? loading : "Add"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>

    </div>
  );
};

export default AddAvailableProductModal;
