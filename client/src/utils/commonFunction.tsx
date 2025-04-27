import Swal from 'sweetalert2';

export const getServiceType = (type: any) => {
    switch (type) {
        case 'W':
        return 'Warranty';
      case 'B':
        return 'BreakDown';
      case 'M':
        return 'Maintenance';
    }
};

export const getPriorty = (priority: any) => {
  switch (priority) {
      case 'L':
      return 'Low';
    case 'M':
      return 'Medium';
    case 'H':
      return 'High';
    case 'C':
      return 'Critical';
  }
};

export const getExpenseType = (expense_type: any) => {
    switch (expense_type) {
        case 'T':
        return 'Travel';
      case 'F':
        return 'Food';
      case 'P':
        return 'Spare Parts';
    }
  };

export const getStatus = (status: any) => {
    switch (status) {
        case 'X':
        return 'Unassigned';
      case 'P':
        return 'Pending';
      case 'W':
        return 'In Progress';
      case 'C':
        return 'Completed';
      case 'A':
        return 'Customer Approved';
      case 'Y':
        return 'All Completed';
      case 'Z':
        return 'Closed'; 
    }
};

export const showToast = (message: string, type: "success" | "error") => {
        const toast = Swal.mixin({
            toast: true,
            position: 'top-right',
            showConfirmButton: false,
            timer: 3000,
            showCloseButton: true,
            customClass: {
                popup: type === "success" ? `color-success` : `color-danger`,
            },
        });
    
        toast.fire({ title: message });
    };