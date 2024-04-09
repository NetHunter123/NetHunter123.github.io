function showLoader() {
	const loader = document.querySelector('.loader');
	if (loader) {
		loader.style.display = 'block';
	}
}

function hideLoader() {
	const loader = document.querySelector('.loader');
	if (loader) {
		loader.style.display = 'none';
	}
}

const productsContainer = document.querySelector(".products");

const loader = `<div class="loader"/>`
productsContainer.innerHTML = loader

async function renderData(products) {
	const productImagesPromises = products?.map(product => getImage(product.images));
	const productImages = await Promise.all(productImagesPromises);
	let likedProducts
	try {
		likedProducts = JSON.parse(localStorage.getItem("likedProducts")) || []
	} catch (e) {
	
	}
	
	productsContainer.innerHTML = products?.map((product, index) => `
	  <div class="product__card">
			<button class="product__like" data-id="${product.id}" data-liked="false">
				<svg fill="white" height="100%" width="100%" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
					\t viewBox="0 0 471.701 471.701" xml:space="preserve">
					<g>
					\t<path fill="inherit" d="M433.601,67.001c-24.7-24.7-57.4-38.2-92.3-38.2s-67.7,13.6-92.4,38.3l-12.9,12.9l-13.1-13.1
					\t\tc-24.7-24.7-57.6-38.4-92.5-38.4c-34.8,0-67.6,13.6-92.2,38.2c-24.7,24.7-38.3,57.5-38.2,92.4c0,34.9,13.7,67.6,38.4,92.3
					\t\tl187.8,187.8c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-3.9l188.2-187.5c24.7-24.7,38.3-57.5,38.3-92.4
					\t\tC471.801,124.501,458.301,91.701,433.601,67.001z M414.401,232.701l-178.7,178l-178.3-178.3c-19.6-19.6-30.4-45.6-30.4-73.3
					\t\ts10.7-53.7,30.3-73.2c19.5-19.5,45.5-30.3,73.1-30.3c27.7,0,53.8,10.8,73.4,30.4l22.6,22.6c5.3,5.3,13.8,5.3,19.1,0l22.4-22.4
					\t\tc19.6-19.6,45.7-30.4,73.3-30.4c27.6,0,53.6,10.8,73.2,30.3c19.6,19.6,30.3,45.6,30.3,73.3
					\t\tC444.801,187.101,434.001,213.101,414.401,232.701z"/>
					</g>
				</svg>
			</button>
	    <img src="${productImages[index]}" class="product__img" alt="${product.title}" />
	    <h3 class="product__title">
	      ${product.title}
	    </h3>
	    <div class="product__desc_container">
		    <p class="product__desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus consequat euismod magna, sed sodales ligula commodo et. Fusce nec aliquet urna.
		      <span class="product__desc_more">Read More</span>
		    </p>
	    </div>
	    <div class="product__category">
	    	${product.category?.name || "general"}
			</div>
			<div class="product__footer">
				<div class="product__price_wrap">
					<p class="product__price_title">price</p>
	      	<p class="product__price">$ ${product.price}</p>
				</div>
				<button class="product__add">Add to Cart</button>
			</div>
	  </div>
		`).join("")
	
	
	function addLikeProduct(productId) {
		const index = products.findIndex((product) => (+product.id === +productId));
		const existing = likedProducts.some((product) => (+product.id === +productId))
		let product
		if (index !== -1 ) {
			if (existing !== true){
			product = products[index]
			likedProducts.push(product)
			}
		}
	}
	
	function removeLikeProduct(productId) {
		const index = likedProducts.findIndex((product) => (+product.id === +productId));
		if (index !== -1) {
			likedProducts.splice(index, 1);
		}
	}
	
	function saveLikeProducts() {
		localStorage.setItem("likedProducts", JSON.stringify(likedProducts));
	}
	
	const likeButtons = document.querySelectorAll(".product__like");
	
	likeButtons.forEach((item) => {
		const productId = item.dataset.id;
		const existing = likedProducts.some((product) => (+product.id === +productId))
		if (existing){
			item.classList.add("liked");
			item.setAttribute("data-liked", "true")
		}
		
		
		item.addEventListener("click", () => {
			item.classList.toggle("liked");
			const liked = item.getAttribute("data-liked");
			if (liked === "true") {
				item.setAttribute("data-liked", "false")
				removeLikeProduct(productId)
				saveLikeProducts()
			} else {
				item.setAttribute("data-liked", "true")
				addLikeProduct(productId)
				saveLikeProducts()
			}
		});
	});
	
	
	async function getImage(images) {
		let img
		try {
			img = JSON.parse(images)
		} catch (err) {
			img = images
		}
		
		try {
			const result = await checkImg(img);
			return result;
		} catch (error) {
			console.error("Сталася помилка:", error);
			return "https://placehold.co/600x400"; // Повернення значення за замовчуванням у разі помилки
		}
	}
	
	async function checkImg(img) {
		return new Promise((resolve, reject) => {
			const imgTest = new Image();
			imgTest.src = img[0];
			imgTest.onload = function () {
				console.log(`valid src: ${img[0]}`);
				resolve(img[0]);
			}
			imgTest.onerror = function () {
				console.log(`unvalid src: ${img[0]}`);
				resolve("https://placehold.co/600x400");
			}
		});
		
	}
	
	const moreButtons = document.querySelectorAll(".product__desc_more");
	moreButtons.forEach((item) => {
		item.addEventListener("click", () => {
			const container = item.parentNode;
			container.classList.toggle("expanded");
			item.textContent = container.classList.contains("expanded") ? "Read Less" : "Read More";
		});
	});
}

async function getData() {
	showLoader()
	try {
		await fetch('https://api.escuelajs.co/api/v1/products')
			.then(data=>{
				return data.json();
			})
			.then((data) => {
				console.log("products", data)
				hideLoader();
				renderData(data)
			}).catch((err) => {
				console.log(err)
				hideLoader();
				productsContainer.innerHTML = "Помилка завантаження даних..."
			})
	} catch (error) {
		console.error('Помилка при отриманні даних:', error);
		hideLoader();
	}
}

getData()
