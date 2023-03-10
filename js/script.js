let incomes = [];
let spendings = [];
/* 
Przychód (income) będzie obiektem: 
@income:
{
  id: Number,
  title: String,
  value: Number
}

Wydatki (spending) będą również obiektem: 
@spending:
{
  id: Number,
  title: String,
  value: Number
}
*/

const incomeTable = document.getElementById("income-table");
const incomeName = document.getElementById("income");
const incomeValue = document.getElementById("valueIncome");
const incomeForm = document.getElementById("income-form");
const sumIncome = document.getElementById("sumIncome");


const spendingTable = document.getElementById("spending-table");
const spendingName = document.getElementById("spending");
const spendingValue = document.getElementById("valueSpending");
const spendingForm = document.getElementById("spending-form");
const sumSpending = document.getElementById("sumSpending");

const totalBudget = document.getElementById("total-budget");

let sumTotal = 0;
let incomeSum = 0;
let spendingSum = 0;

/* Function to remove selected income or spending */
const removeElement = (event, tableId) => {
  incomes = incomes.filter((item) => item.id !== tableId);
  spendings = spendings.filter((item) => item.id !== tableId);

  const element = event.currentTarget;
  const elementParent = element.closest(".budget-list");
  elementParent.remove();

  calcSum(incomes, sumIncome);
  calcSum(spendings, sumSpending);
  sumBudget(incomeSum, spendingSum);
}

/* Function to edit income or spending */
const editElement = (event, budget, table) => {
  const element = event.currentTarget;
  const elementParent = element.closest(".budget-list");
  elementParent.innerHTML = "";

  const editForm = document.createElement("form");
  editForm.classList.add("editedForm");
  const editTitleInput = document.createElement("input");
  const editValueInput = document.createElement("input");
  const div = document.createElement("div");
  const buttonToConfirmEdit = document.createElement("button");

  div.classList.add("budget-action");
  editTitleInput.classList.add("form-container-input");
  editTitleInput.setAttribute("name", "editTitle");
  editTitleInput.classList.add("editTitle");
  editValueInput.classList.add("form-container-input");
  editValueInput.setAttribute("name", "editValue");
  editValueInput.classList.add("editValue");
  editValueInput.setAttribute("step", "0.01");
  editValueInput.setAttribute("min", "0.01");
  buttonToConfirmEdit.classList.add("tooltip");
  buttonToConfirmEdit.type = "submit";
  buttonToConfirmEdit.innerHTML = `✔️ <span class="tooltiptext">Confirm</span>`;

  editTitleInput.type = "text";
  editValueInput.type = "number";
  editTitleInput.value = `${budget.title}`;
  editValueInput.value = `${budget.value}`;
  
  editForm.appendChild(editTitleInput);
  editForm.appendChild(editValueInput);
  elementParent.appendChild(editForm);
  div.appendChild(buttonToConfirmEdit);
  elementParent.appendChild(div);

  buttonToConfirmEdit.addEventListener("click", (e) => {
    e.preventDefault();
    
    budget.title = editTitleInput.value;
    if (budget.title == false) {
      window.alert("This field can not be empty!");
      editTitleInput.focus();
      return;
    };
    
    budget.value = editValueInput.value;
    if (budget.value <= 0) {
      window.alert("The value can not be empty or less that 0!");
      editValueInput.focus();
      return;
    };
    budget.value = Number(Math.round(editValueInput.value + 'e+2') + 'e-2');
    elementParent.remove();
    renderElement(budget, table);
    calcSum(incomes, sumIncome);
    calcSum(spendings, sumSpending);
    sumBudget(incomeSum, spendingSum);
  });
}

/* Function to render income or spending on the screen */
const renderElement = (budget, table) => {
  const newElement = document.createElement("div");
  newElement.id = `element-${budget.id}`;
  newElement.classList.add("budget-list");

  const elementTitleAndValue = document.createElement("p");
  elementTitleAndValue.classList.add("budget-item");
  elementTitleAndValue.innerHTML = `<span>${budget.title} - ${budget.value} PLN</span>`;

  const budgetAction = document.createElement("div");
  budgetAction.classList.add("budget-action");

  const editBudget = document.createElement("button");
  const deleteBudget = document.createElement("button");

  deleteBudget.addEventListener("click", (e) => removeElement(e, budget.id));
  editBudget.addEventListener("click", (e) => editElement(e, budget, table));
  editBudget.classList.add("tooltip");
  deleteBudget.classList.add("tooltip");

  editBudget.innerText = "🖊️";
  deleteBudget.innerText = "❌";

  const tooltipTextEdit = document.createElement("span");
  const tooltipTextDelete = document.createElement("span");
  tooltipTextEdit.classList.add("tooltiptext");
  tooltipTextDelete.classList.add("tooltiptext");
  tooltipTextEdit.innerText = "Edit";
  tooltipTextDelete.innerText = "Delete";

  editBudget.appendChild(tooltipTextEdit);
  deleteBudget.appendChild(tooltipTextDelete);

  budgetAction.appendChild(editBudget);
  budgetAction.appendChild(deleteBudget);

  newElement.appendChild(elementTitleAndValue);
  newElement.appendChild(budgetAction);
  table.appendChild(newElement);
}

const calcSum = (table, sumField) => {
  sum = table.map(element => Number(element.value)).reduce((a, b) => a + b, 0);
  sumField.innerText = sum;
  if (sumField === sumIncome) {
    incomeSum = sum;
  } else {
    spendingSum = sum;
  };
}

const sumBudget = (incomeSum, spendingSum) => {
  sumTotal = incomeSum - spendingSum;
  sumTotal = Number(Math.round(sumTotal + 'e+2') + 'e-2');
  if (sumTotal > 0) {
    totalBudget.innerText = `You can still spend ${sumTotal} PLN.`;
  } else if (sumTotal < 0) {
    totalBudget.innerText = `The balance is negative. You are in negative ${(-sumTotal)} PLN.`;
  } else {
    totalBudget.innerText = `The balance is zero PLN.`;
  }
}

const addIncome = (event) => {
  event.preventDefault();
  const incomeTitle = incomeName.value.trim();
  if (incomeTitle === "") {
    window.alert("You want to add income with a name consisting of just spaces!");
    incomeName.focus();
    return;
  };
  const valueOfIncome = incomeValue.value;

  const incomeId = Date.now();

  const income = {
    id: incomeId,
    title: incomeTitle,
    value: valueOfIncome
  };

  incomes.push(income);
  renderElement(income, incomeTable);
  calcSum(incomes, sumIncome);
  sumBudget(incomeSum, spendingSum);
  incomeName.value = "";
  incomeValue.value = "";
};

const addSpending = (event) => {
  event.preventDefault();
  const spendingTitle = spendingName.value.trim();
  if (spendingTitle === "") {
    window.alert("You want to add spending with a name consisting of just spaces!");
    spendingName.focus();
    return;
  };
  const valueOfSpending = spendingValue.value;

  const spendingId = Date.now();

  const spending = {
    id: spendingId,
    title: spendingTitle,
    value: valueOfSpending
  };

  spendings.push(spending);
  renderElement(spending, spendingTable);
  calcSum(spendings, sumSpending);
  sumBudget(incomeSum, spendingSum);
  spendingName.value = "";
  spendingValue.value = "";
}

incomeForm.addEventListener("submit", addIncome);
spendingForm.addEventListener("submit", addSpending);