// Utility functions
const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

const createTableHeader = () => {
    const thead = document.createElement('thead');
    thead.innerHTML = `
    <tr>
      <th class="Quantity">Quantity</th>
      <th class="Item">Item</th>
      <th class="Title"></th>
      <th class="StoreURL">Buy URL</th>
      <th class="Price">Price<br>per item</th>
      <th class="Tax">Tax</th>
      <th class="Total">Total with Tax</th>
    </tr>
  `;
    return thead;
};

const createTableFooter = () => {
    const tfoot = document.createElement('tfoot');
    tfoot.setAttribute('id', 'table-footer'); // Add an ID to the footer for easy access
    return tfoot;
};

function calculateTaxAndTotal(price, quantity, taxRate) {
    const taxAmount = price * quantity * (taxRate / 100);
    const totalWithTax = (price * quantity) + taxAmount;

    return {
        taxAmount: +(taxAmount.toFixed(2)), // Convert string back to number with two decimals
        totalWithTax: +(totalWithTax.toFixed(2)) // Convert string back to number with two decimals
    };
}

const createTableRow = (itemData, taxRate) => {
  const { taxAmount, totalWithTax } = calculateTaxAndTotal(itemData.price, itemData.qty, taxRate);

  // Build additional info string with SKU, Model, and optional Note
  let additionalInfo = `<br>
    <span class="SKU"><strong>SKU:</strong> ${itemData.sku}</span>
    <br><br>
    <span class="Model"><strong>Model:</strong> ${itemData.model}</span>
  `;

  // Add note if it exists and is not empty
  if (itemData.note && itemData.note.trim() !== "") {
    additionalInfo += `<br><br>
    <span class="Note"><strong>Note:</strong> ${itemData.note}</span>`;
  }

  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td class="Quantity">${itemData.qty}</td>
    <td class="Item">${itemData.item}</td>
    <td class="Title">
      ${itemData.title}<br>
      ${additionalInfo}
    </td>
    <td class="StoreURL">
      <span class="StoreName"><a href="${itemData.buy_url}">${itemData.store_name}</a></span><br>
    </td>
    <td>${formatCurrency(itemData.price)}</td>
    <td class="Tax">${formatCurrency(taxAmount)}</td>
    <td class="Total">${formatCurrency(totalWithTax)}</td>
  `;
  return tr;
};


const appendTotalRow = (tfoot, total, totalTax, grandTotal) => {
    tfoot.innerHTML = ''; // Clear any existing footer content
    const totalPriceRow = document.createElement('tr');
    totalPriceRow.innerHTML = `
    <td colspan="4">Totals:</td>
    <td>${formatCurrency(total)}</td>
    <td>${formatCurrency(totalTax)}</td>
    <td>${formatCurrency(grandTotal)}</td>
  `;
    tfoot.appendChild(totalPriceRow);
};


// Main function to populate table with data
const populateTable = (data) => {
    const table = document.getElementById('computerPartsTable');
    table.innerHTML = ''; // Clear the table before populating
    table.appendChild(createTableHeader());

    const tbody = document.createElement('tbody');
    table.appendChild(tbody);

    const tfoot = createTableFooter();
    table.appendChild(tfoot);

    let total = 0;
    let totalTax = 0;
    let grandTotal = 0;

    data.forEach((item) => {
        const price = parseFloat(item.price); // Use the correct property name 'price' from JSON data
        const quantity = parseInt(item.qty, 10); // Use 'qty' from JSON data

        const tr = createTableRow(item, 8.25);
        tbody.appendChild(tr);

        const { taxAmount, totalWithTax } = calculateTaxAndTotal(price, quantity, 8.25);
        total += price * quantity;
        totalTax += taxAmount;
        grandTotal += totalWithTax;
    });

    appendTotalRow(tfoot, total, totalTax, grandTotal);
};

// Fetch JSON data and initiate table population
const fetchAndDisplayData = () => {
    fetch('data.json')
        .then(response => response.json())
        .then(data => populateTable(data))
        .catch(error => console.error('Error fetching data:', error));
};

// Event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', fetchAndDisplayData);
