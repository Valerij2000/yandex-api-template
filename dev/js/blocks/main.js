// Micromodal  
  if (document.querySelector('.modal')) {
    MicroModal.init({
      onClose: function (modal, element, event) {
        event.preventDefault();
        event.stopPropagation();
      },
      // onClose: modal => console.info(`${modal.id} is hidden`),
      openTrigger: "data-custom-open",
      closeTrigger: "data-micromodal-close",
      openClass: "is-open",
      disableScroll: true,
      disableFocus: false,
      awaitOpenAnimation: false,
      awaitCloseAnimation: false,
      debugMode: false,
    });

    MicroModal.show("modal-age");
    document.body.classList.add("prevent-scroll");
    const dayInput = document.querySelector("#day"),
      monthInput = document.querySelector("#month"),
      yearInput = document.querySelector("#year"),
      formAge = document.querySelector(".formAge");

    const today = new Date();
    const year = today.getFullYear();

    dayInput.addEventListener('keyup', function () {
      moveToNext(this, 'month');
    })
    monthInput.addEventListener('keyup', function () {
      moveToNext(this, 'year');
    })
    yearInput.addEventListener('keyup', function () {
      moveToNext(this, 'button-accept');
    })

    function moveToNext(field, nextFieldID) {
      if (
        field.value.length >= field.maxLength &&
        !field.classList.contains("invalid")
      ) {
        document.getElementById(nextFieldID).focus();
      }
    }

    if (!localStorage.getItem("adult")) {
      // day operations
      dayInput.addEventListener("input", (e) => {
        if (
          dayInput.value.length < 1 ||
          Number(dayInput.value) > 31 ||
          dayInput.value === "0" ||
          dayInput.value === "00"
        ) {
          dayInput.classList.add("invalid");
        } else {
          dayInput.classList.remove("invalid");
        }
      });

      // month operations
      monthInput.addEventListener("input", (e) => {
        if (
          monthInput.value.length < 1 ||
          Number(monthInput.value) > 12 ||
          monthInput.value === "0" ||
          monthInput.value === "00"
        ) {
          monthInput.classList.add("invalid");
        } else {
          monthInput.classList.remove("invalid");
        }
      });

      // year operations
      yearInput.addEventListener("input", (e) => {
        if (
          yearInput.value.length < 4 ||
          Number(yearInput.value) < 1900 ||
          Number(yearInput.value) > year
        ) {
          yearInput.classList.add("invalid");
        } else {
          yearInput.classList.remove("invalid");
        }
      });

      // submit handlers
      const submitButton = document.querySelector(".modal__button-accept");
      let yourAge, safeAge, nowDate;

      submitButton.addEventListener("click", function (e) {
        e.preventDefault();
        if (
          dayInput.classList.contains("invalid") ||
          monthInput.classList.contains("invalid") ||
          yearInput.classList.contains("invalid") ||
          yearInput.value === "" ||
          dayInput.value === "" ||
          monthInput.value === ""
        )
          return;

        //значение инпута
        yourAge = new Date(yearInput.value, monthInput.value - 1, dayInput.value);
        //nowDate = Date.now();

        //проверка возраста на 18
        var ageDifMs = Date.now() - yourAge.getTime();
        var ageDate, age;
        if (ageDifMs > 0) {
          ageDate = new Date(ageDifMs);
          age = Math.abs(ageDate.getUTCFullYear() - 1970);
        } else {
          age = 1;
        }

        if (age > 17) {
          localStorage.setItem("adult", 18);
          MicroModal.close("modal-age");
          document.body.classList.remove("prevent-scroll");
          document.body.classList.remove("blur");
        } else if (0 < age < 17) {
          localStorage.setItem("adult", 0);
          MicroModal.close("modal-age");
          document.body.classList.add("prevent-scroll");
          MicroModal.show("modal-adult");
        } else {
          document.body.classList.add("prevent-scroll");
          formAge.classList.add("invalid");
        }
      });
    } else if (localStorage.getItem("adult") == 0) {
      MicroModal.close("modal-age");
      document.body.classList.add("prevent-scroll");
      MicroModal.show("modal-adult");
    } else {
      MicroModal.close("modal-age");
      document.body.classList.remove("blur");
      document.body.classList.remove("prevent-scroll");
    }

    //only num on input age
    const ageInput = document.querySelectorAll(".formAge__input");

    function setInputFilter(textbox, inputFilter) {
      [
        "input",
        "keydown",
        "keyup",
        "mousedown",
        "mouseup",
        "select",
        "contextmenu",
        "drop",
      ].forEach(function (event) {
        textbox.addEventListener(event, function () {
          if (inputFilter(this.value)) {
            this.oldValue = this.value;
            this.oldSelectionStart = this.selectionStart;
            this.oldSelectionEnd = this.selectionEnd;
          } else if (this.hasOwnProperty("oldValue")) {
            this.value = this.oldValue;
            this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
          } else {
            this.value = "";
          }
        });
      });
    }
    ageInput.forEach(function (myInput) {
      setInputFilter(myInput, function (value) {
        return /^\d*\.?\d*$/.test(value); // Allow digits and '.' only, using a RegExp
      });
    });
  }