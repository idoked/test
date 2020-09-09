const catalog = document.getElementById('catalog'),
			filter = document.getElementById('filter')

let filteredProducts = [],
		areaToggle = false,
		equipmentToggle = false


const renderProduct = product => {

	if (product.active) {

		let equipment = ''

			for (key in product.equipment) {
				if (product.equipment[key]) {
					equipment += '<img src="img/general/'+ key +'.svg" alt="' + key + '">'
				}
			}

		catalog.innerHTML += '<article class="product"><img class="product__image" src="' + product.image + '" alt="' + product.title + '"><div class="product__content"><div class="info"><h4 class="product__title">' + product.title + '</h4><ul class="product__specs"><li class="product__spec-item">Размеры (ШхГхВ) - ' + product.size  + '</li><li class="product__spec-item">Площадь - ' + product.area + ' м2</li><li class="product__spec-item">Оснащение номера ' + equipment + '</li><li class="product__spec-item">Цена за сутки: <strong> ' + product.price + '₽</strong></li></ul></div><button class="product__button">Забронировать</button></div></article>'
	}

}

window.addEventListener('input', () => filterCheck(), false)

const filterCheck = () => {

	let areaInputs = document.getElementsByName("area"),
			equipmentInputs = document.getElementsByName("equipment"),
			equipmentToggleInputs = 0,
			areaToggleInputs = 0,
			priceToggleInputs = 0


	for (key in areaInputs) {
		if (areaInputs[key].checked) areaToggleInputs++
	}

	for (key in equipmentInputs) {
		if (equipmentInputs[key].checked) equipmentToggleInputs++
	}

	equipmentToggle = (equipmentToggleInputs != 0) ? true : false
	
	areaToggle = (areaToggleInputs != 0) ? true : false

	if (!areaToggle && !equipmentToggle) {
		catalogReset()
		filter.classList.remove('active')
	} else {
		filter.classList.add('active')
	}

}


const filterReset = () => {

	let inputs = filter.getElementsByTagName("input")

	for (key in inputs) {
		inputs[key].checked = false
	}

	filterCheck()
	catalogReset()
}


const catalogReset = () => {
	filteredProducts = JSON.parse(JSON.stringify(products))
	renderProducts(filteredProducts)
}


const filterSubmit = event => {

	event.preventDefault()
	

	let equipmentInputs = filter.querySelectorAll("input[name='equipment']"),
			areaInputs = filter.querySelectorAll("input[name='area']"),
			equipmentValues = [],
			areaValues = []

	for (key in equipmentInputs) {
		if (equipmentInputs[key].checked) {
			equipmentValues.push(equipmentInputs[key].value)
		}
	}

	for (key in areaInputs) {
		if (areaInputs[key].checked) {
			let valueInt = parseFloat(areaInputs[key].value, 10)
			areaValues.push(valueInt)
		}
	}

	filterSort(areaValues, equipmentValues)

}


const filterSort = (areaValues, equipmentValues) => {
	
	filteredProducts = JSON.parse(JSON.stringify(products))

	if (areaToggle) filteredProducts = filterArea(areaValues, filteredProducts)
	if (equipmentToggle) filteredProducts = filterEquipment(equipmentValues, filteredProducts)

	renderProducts(filteredProducts)

}

const filterArea = (areaValues, products) => {

	for (let item of products) {
			if (item.active){
				let area = 0

				for (let value of areaValues) {
					if (value === item.area) area++
				}
				
				item.active = (area === 0) ? false : true
			}

	}

	return products
}

const filterEquipment = (equipmentValues, products) => {

	for (let item of filteredProducts) {

		if (item.active) { 

			let equipment = 0
				
				for (let value of equipmentValues) {
					if (item.equipment[value]) equipment++
				}

			item.active = (equipment === 0) ? false : true
		}
	}

	return products
}

const renderProducts = products => {

	catalog.innerHTML = ''

	for (let item of products) {
		renderProduct(item)
	}
}

renderProducts(products)