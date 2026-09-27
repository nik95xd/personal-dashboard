const themeToggle = document.querySelector("#theme-toggle");
const firstNumberInput = document.querySelector("#first-number");
const secondNumberInput = document.querySelector("#second-number");
const calculatorResult = document.querySelector("#calculator-result");
const operationButtons = document.querySelectorAll("[data-operation]");

const savedTheme = localStorage.getItem("dashboard-theme");

if (savedTheme === "dark") {
    document.documentElement.dataset.theme = "dark";
    themeToggle.setAttribute("aria-pressed", "true");
}

themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.dataset.theme !== "dark";

    if (isDark) {
        document.documentElement.dataset.theme = "dark";
    } else {
        delete document.documentElement.dataset.theme;
    }

    themeToggle.setAttribute("aria-pressed", String(isDark));
    localStorage.setItem("dashboard-theme", isDark ? "dark" : "light");
});

operationButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const firstValue = firstNumberInput.value;
        const secondValue = secondNumberInput.value;

        if (firstValue === "" || secondValue === "") {
            calculatorResult.textContent = "Enter both numbers to calculate.";
            return;
        }

        const firstNumber = Number(firstValue);
        const secondNumber = Number(secondValue);
        let result;

        switch (button.dataset.operation) {
            case "add":
                result = firstNumber + secondNumber;
                break;
            case "subtract":
                result = firstNumber - secondNumber;
                break;
            case "multiply":
                result = firstNumber * secondNumber;
                break;
            case "divide":
                if (secondNumber === 0) {
                    calculatorResult.textContent = "Cannot divide by zero.";
                    return;
                }
                result = firstNumber / secondNumber;
                break;
            default:
                return;
        }

        calculatorResult.textContent = `Result: ${result}`;
    });
});