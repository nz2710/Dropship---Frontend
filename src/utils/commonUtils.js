import { toast } from "react-toastify";

export const getSortIcon = (column, orderBy, sortBy) => {
  if (orderBy === column) {
    return sortBy === "asc" ? (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block ml-1" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block ml-1" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    );
  }
  return null;
};

export const handleSort = (column, orderBy, sortBy, setOrderBy, setSortBy) => {
  if (orderBy === column) {
    setSortBy(sortBy === "asc" ? "desc" : "asc");
  } else {
    setOrderBy(column);
    setSortBy("asc");
  }
};

export const handleDelete = async (url, id, token, onSuccess) => {
  if (window.confirm("Are you sure you want to delete this?")) {
  try {
    const response = await fetch(`${url}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
    });
    if (response.status === 200) {
      toast.success("Item successfully deleted.");
      if (onSuccess) onSuccess();
    } else {
      throw new Error("Failed to delete item");
    }
  } catch (error) {
    toast.error("Error: " + error.message);
  }
}
};

// export const formatNumber = (number) => {
//   return number ? parseFloat(number).toLocaleString("en-US") : "";
// };

export const formatNumber = (number) => {
  if (number === null || number === undefined) return "";
  
  const parsedNumber = parseFloat(number);
  
  if (isNaN(parsedNumber)) return "";
  
  return parsedNumber.toLocaleString("en-US");
};