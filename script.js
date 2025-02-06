document.addEventListener("DOMContentLoaded", function () {
  // --- Regex patterns ---
  const nameRegex = /^[A-Za-z0-9]+$/; // alphanumeric only (no special characters)
  const emailRegex = /^[^\s@]+@northeastern\.edu$/i; // must end with @northeastern.edu
  const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/; // (XXX) XXX-XXXX
  const zipRegex = /^\d{5}$/; // exactly 5 digits

  // --- Min/Max lengths ---
  const nameMin = 2,
    nameMax = 30;
  const emailMin = 5,
    emailMax = 50;
  const commentsMin = 10,
    commentsMax = 300;
  const dynamicTextMin = 1; // if dynamic text field is present, it must not be blank
  const address2Max = 20; // for street address 2 (also used for live counter)

  // --- Field references ---
  const form = document.getElementById("feedbackForm");
  const submitButton = document.getElementById("submitButton");
  const resetButton = document.getElementById("resetButton");
  const titleRadios = document.querySelectorAll('input[name="title"]');
  const firstNameField = document.getElementById("firstName");
  const lastNameField = document.getElementById("lastName");
  const emailField = document.getElementById("emailId");
  const phoneField = document.getElementById("phoneNumber");
  const zipField = document.getElementById("zipcode");
  const address2Field = document.getElementById("address2");
  const sourceCheckboxes = document.querySelectorAll('input[name="source"]');
  const commentsField = document.getElementById("comments");
  const listSelect = document.getElementById("listSelect");
  const dynamicCheckboxContainer = document.getElementById(
    "dynamicCheckboxContainer"
  );
  const address2Counter = document.getElementById("address2Counter");

  // --- Error message elements ---
  const titleError = document.getElementById("titleError");
  const firstNameError = document.getElementById("firstNameError");
  const lastNameError = document.getElementById("lastNameError");
  const emailError = document.getElementById("emailError");
  const phoneError = document.getElementById("phoneError");
  const zipError = document.getElementById("zipError");
  const sourceError = document.getElementById("sourceError");
  const commentsError = document.getElementById("commentsError");
  const listError = document.getElementById("listError");

  // --- Variables for dynamic text field (attached to dynamic checkbox) ---
  let dynamicTextField = null;
  let dynamicTextError = null;

  // --- Helper functions for error highlighting ---
  function setInvalid(field, errorElement, message) {
    field.classList.add("invalid");
    if (errorElement) {
      errorElement.textContent = message;
    }
  }
  function setValid(field, errorElement) {
    field.classList.remove("invalid");
    if (errorElement) {
      errorElement.textContent = "";
    }
  }

  // --- Validation Functions ---
  function validateTitle() {
    const selected = document.querySelector('input[name="title"]:checked');
    if (!selected) {
      titleError.textContent = "Please select a title.";
      return false;
    }
    titleError.textContent = "";
    return true;
  }

  function validateFirstName() {
    const value = firstNameField.value.trim();
    if (value === "") {
      setInvalid(firstNameField, firstNameError, "First Name cannot be empty.");
      return false;
    } else if (value.length < nameMin) {
      setInvalid(
        firstNameField,
        firstNameError,
        "At least " + nameMin + " characters required."
      );
      return false;
    } else if (value.length > nameMax) {
      setInvalid(
        firstNameField,
        firstNameError,
        "At most " + nameMax + " characters allowed."
      );
      return false;
    } else if (!nameRegex.test(value)) {
      setInvalid(
        firstNameField,
        firstNameError,
        "Only alphanumeric characters allowed."
      );
      return false;
    }
    setValid(firstNameField, firstNameError);
    return true;
  }

  function validateLastName() {
    const value = lastNameField.value.trim();
    if (value === "") {
      setInvalid(lastNameField, lastNameError, "Last Name cannot be empty.");
      return false;
    } else if (value.length < nameMin) {
      setInvalid(
        lastNameField,
        lastNameError,
        "At least " + nameMin + " characters required."
      );
      return false;
    } else if (value.length > nameMax) {
      setInvalid(
        lastNameField,
        lastNameError,
        "At most " + nameMax + " characters allowed."
      );
      return false;
    } else if (!nameRegex.test(value)) {
      setInvalid(
        lastNameField,
        lastNameError,
        "Only alphanumeric characters allowed."
      );
      return false;
    }
    setValid(lastNameField, lastNameError);
    return true;
  }

  function validateEmail() {
    const value = emailField.value.trim();
    if (value === "") {
      setInvalid(emailField, emailError, "Email cannot be empty.");
      return false;
    } else if (value.length < emailMin) {
      setInvalid(
        emailField,
        emailError,
        "At least " + emailMin + " characters required."
      );
      return false;
    } else if (value.length > emailMax) {
      setInvalid(
        emailField,
        emailError,
        "At most " + emailMax + " characters allowed."
      );
      return false;
    } else if (!emailRegex.test(value)) {
      setInvalid(
        emailField,
        emailError,
        "Email must be in the format yourname@northeastern.edu."
      );
      return false;
    }
    setValid(emailField, emailError);
    return true;
  }

  // --- Phone Input Masking ---
  function maskPhone() {
    let numbers = phoneField.value.replace(/\D/g, "");
    if (numbers.length > 10) {
      numbers = numbers.substring(0, 10);
    }
    let formatted = "";
    if (numbers.length > 0) {
      formatted = "(" + numbers.substring(0, 3);
    }
    if (numbers.length >= 4) {
      formatted += ") " + numbers.substring(3, 6);
    }
    if (numbers.length >= 7) {
      formatted += "-" + numbers.substring(6, 10);
    }
    phoneField.value = formatted;
  }

  function validatePhone() {
    const value = phoneField.value.trim();
    if (value === "") {
      setInvalid(phoneField, phoneError, "Phone Number cannot be empty.");
      return false;
    } else if (!phoneRegex.test(value)) {
      setInvalid(phoneField, phoneError, "Format must be (XXX) XXX-XXXX.");
      return false;
    }
    setValid(phoneField, phoneError);
    return true;
  }

  function validateZip() {
    const value = zipField.value.trim();
    if (value === "") {
      setInvalid(zipField, zipError, "Zip Code cannot be empty.");
      return false;
    } else if (!zipRegex.test(value)) {
      setInvalid(zipField, zipError, "Zip Code must be exactly 5 digits.");
      return false;
    }
    setValid(zipField, zipError);
    return true;
  }

  // Street Address 2 is optional (live counter is handled separately)
  function validateAddress2() {
    return true;
  }

  function validateSource() {
    let isChecked = false;
    sourceCheckboxes.forEach(function (checkbox) {
      if (checkbox.checked) {
        isChecked = true;
      }
    });
    if (!isChecked) {
      sourceError.textContent = "Select at least one option.";
      return false;
    }
    sourceError.textContent = "";
    return true;
  }

  function validateComments() {
    const value = commentsField.value.trim();
    if (value === "") {
      setInvalid(commentsField, commentsError, "Comments cannot be empty.");
      return false;
    } else if (value.length < commentsMin) {
      setInvalid(
        commentsField,
        commentsError,
        "At least " + commentsMin + " characters required."
      );
      return false;
    } else if (value.length > commentsMax) {
      setInvalid(
        commentsField,
        commentsError,
        "At most " + commentsMax + " characters allowed."
      );
      return false;
    }
    setValid(commentsField, commentsError);
    return true;
  }

  function validateSelect() {
    if (listSelect.value === "") {
      listError.textContent = "Please select an option.";
      return false;
    }
    listError.textContent = "";
    return true;
  }

  // Validate dynamic text field if it exists (only required if dynamic checkbox is checked)
  function validateDynamicTextField() {
    if (dynamicTextField && dynamicTextField.parentNode) {
      const value = dynamicTextField.value.trim();
      if (value === "") {
        dynamicTextField.classList.add("invalid");
        if (dynamicTextError) {
          dynamicTextError.textContent = "This field is mandatory.";
        }
        return false;
      } else {
        dynamicTextField.classList.remove("invalid");
        if (dynamicTextError) {
          dynamicTextError.textContent = "";
        }
        return true;
      }
    }
    return true;
  }

  // Overall form validation: enable submit only if all validations pass
  function validateForm() {
    const valid =
      validateTitle() &&
      validateFirstName() &&
      validateLastName() &&
      validateEmail() &&
      validatePhone() &&
      validateZip() &&
      validateAddress2() &&
      validateSource() &&
      validateComments() &&
      validateSelect() &&
      validateDynamicTextField();
    submitButton.disabled = !valid;
    return valid;
  }

  // --- Dynamic List & Checkbox ---
  // When a list option is selected, create a dynamic checkbox.
  function handleSelectChange() {
    const selectedValue = listSelect.value;
    // Clear any previous dynamic checkbox and text field
    dynamicCheckboxContainer.innerHTML = "";
    dynamicTextField = null;
    dynamicTextError = null;
    if (selectedValue !== "") {
      // Create dynamic checkbox
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = "dynamicCheckbox";
      checkbox.name = "dynamicCheckbox";
      checkbox.value = selectedValue;
      // Create label for the checkbox
      const label = document.createElement("label");
      label.htmlFor = "dynamicCheckbox";
      label.textContent = " I confirm selection: " + selectedValue;
      dynamicCheckboxContainer.appendChild(checkbox);
      dynamicCheckboxContainer.appendChild(label);
      // Listen for change events on the dynamic checkbox
      checkbox.addEventListener("change", handleDynamicCheckboxChange);
    }
  }

  // --- Dynamic Text Field based on Dynamic Checkbox ---
  // If the dynamic checkbox is checked, add a mandatory text field.
  // When unchecked, remove the text field.
  function handleDynamicCheckboxChange(event) {
    const checkbox = event.target;
    if (checkbox.checked) {
      if (!dynamicTextField) {
        const container = document.createElement("div");
        container.id = "dynamicTextContainer";
        // Create the text field
        dynamicTextField = document.createElement("input");
        dynamicTextField.type = "text";
        dynamicTextField.id = "dynamicTextField";
        dynamicTextField.placeholder = "Enter additional info";
        // Create an error span for this field
        dynamicTextError = document.createElement("span");
        dynamicTextError.id = "dynamicTextError";
        dynamicTextError.className = "error";
        container.appendChild(dynamicTextField);
        container.appendChild(dynamicTextError);
        dynamicCheckboxContainer.appendChild(container);
        // Validate the dynamic text field in real time
        dynamicTextField.addEventListener("keyup", function () {
          validateDynamicTextField();
          validateForm();
        });
      }
    } else {
      const container = document.getElementById("dynamicTextContainer");
      if (container) {
        container.remove();
      }
      dynamicTextField = null;
      dynamicTextError = null;
    }
    validateForm();
  }

  // --- Live Character Counter for Street Address 2 ---
  function updateAddress2Counter() {
    const length = address2Field.value.length;
    address2Counter.textContent =
      length + "/" + address2Max + " characters used";
  }

  // --- Event Listeners for Real-Time Validation ---
  titleRadios.forEach((radio) =>
    radio.addEventListener("change", validateForm)
  );
  firstNameField.addEventListener("keyup", validateForm);
  lastNameField.addEventListener("keyup", validateForm);
  emailField.addEventListener("keyup", validateForm);
  phoneField.addEventListener("keyup", function () {
    maskPhone();
    validatePhone();
    validateForm();
  });
  phoneField.addEventListener("change", function () {
    maskPhone();
    validatePhone();
    validateForm();
  });
  zipField.addEventListener("keyup", validateForm);
  address2Field.addEventListener("keyup", function () {
    updateAddress2Counter();
    validateForm();
  });
  sourceCheckboxes.forEach((checkbox) =>
    checkbox.addEventListener("change", validateForm)
  );
  commentsField.addEventListener("keyup", validateForm);
  listSelect.addEventListener("change", function () {
    validateForm();
    handleSelectChange();
  });

  // Initial update for address2 counter and form validation
  updateAddress2Counter();
  validateForm();

  // --- Results Table ---
  // When the form is successfully submitted, a new row is appended to the table.
  function addResultRow(data) {
    let resultsContainer = document.getElementById("resultsTableContainer");
    let table = resultsContainer.querySelector("table");
    // Create table and header row if it doesn't exist
    if (!table) {
      table = document.createElement("table");
      const headerRow = document.createElement("tr");
      const headers = [
        "Title",
        "First Name",
        "Last Name",
        "Email",
        "Phone",
        "Zip",
        "Street Address 2",
        "Source",
        "Comments",
        "Selected Option",
        "Dynamic Checkbox",
        "Dynamic Text Field",
      ];
      headers.forEach(function (text) {
        const th = document.createElement("th");
        th.textContent = text;
        headerRow.appendChild(th);
      });
      table.appendChild(headerRow);
      resultsContainer.appendChild(table);
    }
    // Create and append the data row
    const row = document.createElement("tr");
    data.forEach(function (item) {
      const td = document.createElement("td");
      td.textContent = item;
      row.appendChild(td);
    });
    table.appendChild(row);
  }

  // --- Form Submit Handler ---
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (validateForm()) {
      // Gather all form data
      const title = document.querySelector('input[name="title"]:checked').value;
      const firstName = firstNameField.value.trim();
      const lastName = lastNameField.value.trim();
      const email = emailField.value.trim();
      const phone = phoneField.value.trim();
      const zip = zipField.value.trim();
      const address2 = address2Field.value.trim();
      let source = [];
      sourceCheckboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
          source.push(checkbox.value);
        }
      });
      source = source.join(", ");
      const comments = commentsField.value.trim();
      const listOption = listSelect.value;
      let dynamicCheckboxValue = "";
      let dynamicTextValue = "";
      const dynamicCheckbox = document.getElementById("dynamicCheckbox");
      if (dynamicCheckbox) {
        dynamicCheckboxValue = dynamicCheckbox.checked
          ? "Checked"
          : "Not Checked";
      }
      if (dynamicTextField) {
        dynamicTextValue = dynamicTextField.value.trim();
      }

      // Prepare the data for the results table
      const rowData = [
        title,
        firstName,
        lastName,
        email,
        phone,
        zip,
        address2,
        source,
        comments,
        listOption,
        dynamicCheckboxValue,
        dynamicTextValue,
      ];
      addResultRow(rowData);

      // Clear the form (which also resets dynamic elements)
      form.reset();
      dynamicCheckboxContainer.innerHTML = "";
      dynamicTextField = null;
      dynamicTextError = null;
      updateAddress2Counter();
      validateForm();
    } else {
      alert("Please fix the errors in the form.");
    }
  });

  // --- Reset Button Handler ---
  resetButton.addEventListener("click", function () {
    dynamicCheckboxContainer.innerHTML = "";
    dynamicTextField = null;
    dynamicTextError = null;
    updateAddress2Counter();
    validateForm();
  });
});
