var apiIndex = new CallApi();

function getEleIndex(id) {
  return document.getElementById(id);
}

function getListProductIndex() {
  //show loader => display: block
  //getEleIndex("loader").style.display = "block";

  var promise = apiIndex.fectData();

  promise
    .then(function (result) {
      //hide loader => display: none
      //    getEleIndex("loader").style.display = "none";

      //gọi hàm renderUI
      renderUIIndex(result.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}

getListProductIndex();

// Hàm để lấy giỏ hàng từ local storage
function getCartFromLocalStorage() {
  var cartFromStorage = localStorage.getItem("cart");
  return cartFromStorage ? JSON.parse(cartFromStorage) : [];
}

// Hàm để lưu giỏ hàng vào local storage
function saveCartToLocalStorage(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}
var showModal = true; // Biến để kiểm tra xem có hiển thị modal hay không
// Hàm để thêm sản phẩm vào giỏ hàng
function addToCart(product, isOnlyShow, id) {
  // Lấy thông tin sản phẩm

  if (isOnlyShow === 0) {
    var productId = id;
    var productQuantity = product.querySelector(".quantity-value").textContent;
    if (productQuantity == 0) {
      alert("Bạn đã không nhập số lượng cho sản phẩm!");
    } else {
      var productName = product.querySelector(".text_product p").textContent;
      var productPrice =
        product.querySelector(".text_product span").textContent;

      // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
      var existingCartItemIndex = cart.findIndex(
        (item) => item.id === productId
      );

      if (existingCartItemIndex !== -1) {
        // Nếu sản phẩm đã tồn tại, tăng số lượng
        cart[existingCartItemIndex].quantity = (
          parseInt(cart[existingCartItemIndex].quantity) +
          parseInt(productQuantity)
        ).toString();
      } else {
        // Nếu sản phẩm chưa tồn tại, thêm mới vào giỏ hàng
        var cartItem = {
          id: productId,
          name: productName,
          price: productPrice,
          quantity: productQuantity,
        };
        cart.push(cartItem);
      }
    }
  }
  //
  // Cập nhật nội dung của modal giỏ hàng
  updateCartModal();
  updateTotalQuantity();
  // Lưu giỏ hàng vào local storage
  saveCartToLocalStorage(cart);
}

// Khởi tạo giỏ hàng từ local storage
var cart = getCartFromLocalStorage();

// Gọi hàm renderUIIndex để hiển thị sản phẩm

// Hàm cập nhật nội dung của modal giỏ hàng
function updateCartModal() {
  var cartItems = document.getElementById("cartItems");
  cartItems.innerHTML = ""; // Xóa các sản phẩm trước

  // Tính tổng tiền
  var total = 0;

  // Hiển thị sản phẩm trong bảng
  cart.forEach(function (item, index) {
    var row = document.createElement("tr");
    row.innerHTML = `
    <td>${item.name}</td>
    <td>${parseFloat(item.price)}</td>
    <td>
      <div class="quantity">
        <button class="decrement-modal btn btn-secondary" onclick="decrementCartItem(${index})">-</button>
        <span class="quantity-value-modal">${item.quantity}</span>
        <button class="increment-modal btn btn-secondary" onclick="incrementCartItem(${index})">+</button>
      </div>
    </td>
    <td>${formatCurrency(
      parseFloat(calculateTotal(item.price, item.quantity))
    )}</td>
    <td><button class="btn btn-danger" onclick="removeFromCart(${index})">Xóa</button></td>
  `;
    cartItems.appendChild(row);

    // Cộng dồn tổng tiền
    total += parseFloat(calculateTotal(item.price, item.quantity));
  });

  // Hiển thị tổng tiền
  var totalElement = document.getElementById("cartTotal");
  totalElement.innerText = "Tổng Tiền: " + formatCurrency(total);
}
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US").format(amount);
}
function removeFromCart(index) {
  if (index >= 0 && index < cart.length) {
    cart.splice(index, 1); // Xóa sản phẩm khỏi giỏ hàng
    updateCartModal(); // Cập nhật modal
    updateTotalQuantity();
    saveCartToLocalStorage(cart); // Lưu giỏ hàng vào local storage sau khi xóa
  }
}

// Hàm tính tổng tiền cho từng sản phẩm
function calculateTotal(price, quantity) {
  price = parseFloat(price);
  quantity = parseInt(quantity);
  return (price * quantity).toFixed(2);
}

// Bắt sự kiện khi modal được ẩn (để lưu giỏ hàng)
$("#cartModal").on("hidden.bs.modal", function () {
  saveCartToLocalStorage(cart);
});

function renderUIIndex(data) {
  var content = "";
  var content2 = "";
  for (var i = 0; i < data.length; i++) {
    var product = data[i];
    if (product.Type === "----Đồ Chơi----") {
      content += `
        <div class="content_product">
          <div class="image_product">
            <a href="#">
              <img src="./app/images/${product.Images}" alt="">
            </a>
          </div>
          <div class="text_product">
            <p>${product.Name}</p>
            <span>${parseFloat(product.Price)}</span>
          </div>
          <div class="product-actions">
            <div class="quantity">
              <button class="decrement btn btn-secondary">-</button>
              <span class="quantity-value">0</span>
              <button class="increment btn btn-secondary">+</button>
            </div>
            <button class="btn btn-success buy_product" data-toggle="modal" data-target="#cartModal" onclick="addToCart(this.parentElement.parentElement,0,${
              product.id
            })">Mua</button>
            </div>
          </div>
        </div>
      `;
    } else {
      content2 += `
        <div class="content_product">
          <div class="image_product">
            <a href="#">
              <img src="./app/images/${product.Images}" alt="">
            </a>
          </div>
          <div class="text_product">
            <p>${product.Name}</p>
            <span>${parseFloat(product.Price)}</span>
          </div>
          <div class="product-actions">
            <div class="quantity">
              <button class="decrement btn btn-secondary">-</button>
              <span class="quantity-value">0</span>
              <button class="increment btn btn-secondary">+</button>
            </div>
            <button class="btn btn-success buy_product" data-toggle="modal" data-target="#cartModal" onclick="addToCart(this.parentElement.parentElement,0,${
              product.id
            })">Mua</button>
            </div>
          </div>
        </div>
      `;
    }
  }

  getEleIndex("listProduct").innerHTML = content;
  getEleIndex("listProduct2").innerHTML = content2;

  // Bắt sự kiện cho nút cộng và trừ
  var quantityElements = document.querySelectorAll(".quantity");
  quantityElements.forEach(function (quantityElement) {
    var decrementButton = quantityElement.querySelector(".decrement");
    var incrementButton = quantityElement.querySelector(".increment");
    var quantityValue = quantityElement.querySelector(".quantity-value");
    decrementButton.addEventListener("click", function () {
      var currentValue = parseInt(quantityValue.textContent, 10);
      if (currentValue > 0) {
        quantityValue.textContent = (currentValue - 1).toString();
      }
    });

    incrementButton.addEventListener("click", function () {
      var currentValue = parseInt(quantityValue.textContent, 10);
      quantityValue.textContent = (currentValue + 1).toString();
    });
  });
}
updateTotalQuantity();
// Hàm cập nhật tổng số lượng sản phẩm trong giỏ hàng
function updateTotalQuantity() {
  // Tính tổng số lượng từ giỏ hàng
  var totalQuantity = cart.reduce(function (total, item) {
    return total + parseInt(item.quantity, 10);
  }, 0);

  // Hiển thị tổng số lượng trong thẻ <p>
  var soluong_hientai = getEleIndex("soluong_hientai");
  soluong_hientai.textContent = `(${totalQuantity}) Sản Phẩm \n Giỏ Hàng`;
}
function decrementCartItem(index) {
  if (index >= 0 && index < cart.length) {
    var currentItem = cart[index];
    if (currentItem.quantity > 0) {
      currentItem.quantity--;
      updateCartModal(); // Cập nhật lại modal sau khi giảm số lượng
      saveCartToLocalStorage(cart); // Lưu giỏ hàng vào local storage sau khi cập nhật
    }
  }
}

function incrementCartItem(index) {
  if (index >= 0 && index < cart.length) {
    var currentItem = cart[index];
    currentItem.quantity++;
    updateCartModal(); // Cập nhật lại modal sau khi tăng số lượng
    saveCartToLocalStorage(cart); // Lưu giỏ hàng vào local storage sau khi cập nhật
  }
}
function clearCart() {
  cart = []; // Xóa toàn bộ sản phẩm trong giỏ hàng
  updateCartModal(); // Cập nhật modal giỏ hàng
  updateTotalQuantity();
  saveCartToLocalStorage(cart); // Lưu thay đổi vào Local Storage
}
