// ============================================================
// DECOZIN SAREE STORE
// SHOP PAGE
// Fetch Products + Search + Filters + Sorting
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    "use strict";

    if (typeof AOS !== "undefined") {

        AOS.init({
            duration: 600,
            once: true,
            offset: 50
        });

    }

    // your existing shop.js code...

    "use strict";


    // ========================================================
    // API
    // ========================================================

    const API_BASE_URL = "http://localhost:5000";

    const PRODUCT_API =
        `${API_BASE_URL}/api/products`;


    // ========================================================
    // ELEMENTS
    // ========================================================

    const productList =
        document.getElementById("productList");

    const productCount =
        document.getElementById("productCount");

    const productLoading =
        document.getElementById("productLoading");

    const noProducts =
        document.getElementById("noProducts");

    const searchInput =
        document.getElementById("searchInput");

    const materialFilter =
        document.getElementById("materialFilter");

    const occasionFilter =
        document.getElementById("occasionFilter");

    const colorFilter =
        document.getElementById("colorFilter");

    const blouseFilter =
        document.getElementById("blouseFilter");

    const minPrice =
        document.getElementById("minPrice");

    const maxPrice =
        document.getElementById("maxPrice");

    const sortFilter =
        document.getElementById("sortFilter");

    const resetFilters =
        document.getElementById("resetFilters");

    const resetFiltersEmpty =
        document.getElementById("resetFiltersEmpty");


    // ========================================================
    // DATA
    // ========================================================

    let allProducts = [];

    let filteredProducts = [];


    // ========================================================
    // LOAD PRODUCTS
    // ========================================================

    async function loadProducts() {

        try {

            showLoading(true);

            console.log("Fetching products from:");
            console.log(PRODUCT_API);


            const response =
                await fetch(PRODUCT_API);


            if (!response.ok) {

                throw new Error(
                    `Server returned ${response.status}`
                );

            }


            const data =
                await response.json();


            console.log("Products API response:", data);


            if (!data.success) {

                throw new Error(
                    data.message ||
                    "Unable to load products."
                );

            }


            // Only active products
            // are displayed in customer shop.

            allProducts =
                (data.products || [])
                    .filter(product =>
                        product.status === "active"
                    );


            console.log(
                "Active products:",
                allProducts
            );


            populateFilters();

            applyFilters();


        }

        catch (error) {

            console.error(
                "SHOP PRODUCTS ERROR:",
                error
            );


            productList.innerHTML = `

                <div class="col-12">

                    <div class="shop-error">

                        <i class="fa-solid fa-triangle-exclamation"></i>

                        <h3>
                            Unable to Load Sarees
                        </h3>

                        <p>
                            Unable to connect to the product server.
                        </p>

                        <button
                            type="button"
                            class="btn btn-dark"
                            onclick="location.reload()">

                            Try Again

                        </button>

                    </div>

                </div>

            `;


            productCount.innerText =
                "Unable to load products.";

        }

        finally {

            showLoading(false);

        }

    }


    // ========================================================
    // POPULATE FILTER DROPDOWNS
    // ========================================================

    function populateFilters() {

        populateSelect(
            materialFilter,
            allProducts.map(product =>
                product.material
            ),
            "All Materials"
        );


        populateSelect(
            occasionFilter,
            allProducts.map(product =>
                product.occasion
            ),
            "All Occasions"
        );


        populateSelect(
            colorFilter,
            allProducts.map(product =>
                product.color
            ),
            "All Colors"
        );

    }


    // ========================================================
    // CREATE UNIQUE OPTIONS
    // ========================================================

    function populateSelect(
        select,
        values,
        firstOption
    ) {

        const uniqueValues =
            [...new Set(

                values
                    .filter(value =>
                        value &&
                        String(value).trim() !== ""
                    )

                    .map(value =>
                        String(value).trim()
                    )

            )]
                .sort((a, b) =>
                    a.localeCompare(b)
                );


        select.innerHTML = `

            <option value="">
                ${firstOption}
            </option>

        `;


        uniqueValues.forEach(value => {

            const option =
                document.createElement("option");

            option.value = value;

            option.textContent = value;

            select.appendChild(option);

        });

    }


    // ========================================================
    // APPLY FILTERS
    // ========================================================

    function applyFilters() {

        const search =
            searchInput.value
                .trim()
                .toLowerCase();


        const material =
            materialFilter.value;


        const occasion =
            occasionFilter.value;


        const color =
            colorFilter.value;


        const blouse =
            blouseFilter.value;


        const minimumPrice =
            minPrice.value !== ""
                ? Number(minPrice.value)
                : null;


        const maximumPrice =
            maxPrice.value !== ""
                ? Number(maxPrice.value)
                : null;


        // ====================================================
        // FILTER PRODUCTS
        // ====================================================

        filteredProducts =
            allProducts.filter(product => {


                // SEARCH

                const searchText = [

                    product.name,

                    product.description,

                    product.material,

                    product.occasion,

                    product.color

                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();


                if (
                    search &&
                    !searchText.includes(search)
                ) {

                    return false;

                }


                // MATERIAL

                if (
                    material &&
                    product.material !== material
                ) {

                    return false;

                }


                // OCCASION

                if (
                    occasion &&
                    product.occasion !== occasion
                ) {

                    return false;

                }


                // COLOR

                if (
                    color &&
                    product.color !== color
                ) {

                    return false;

                }


                // BLOUSE

                if (
                    blouse &&
                    product.blouseIncluded !== blouse
                ) {

                    return false;

                }


                // MIN PRICE

                if (
                    minimumPrice !== null &&
                    Number(product.price) < minimumPrice
                ) {

                    return false;

                }


                // MAX PRICE

                if (
                    maximumPrice !== null &&
                    Number(product.price) > maximumPrice
                ) {

                    return false;

                }


                return true;

            });


        // ====================================================
        // SORT
        // ====================================================

        sortProducts();


        // ====================================================
        // DISPLAY
        // ====================================================

        renderProducts();

    }


    // ========================================================
    // SORT PRODUCTS
    // ========================================================

    function sortProducts() {

        const sort =
            sortFilter.value;


        if (sort === "price-low") {

            filteredProducts.sort(
                (a, b) =>
                    Number(a.price) -
                    Number(b.price)
            );

        }

        else if (sort === "price-high") {

            filteredProducts.sort(
                (a, b) =>
                    Number(b.price) -
                    Number(a.price)
            );

        }

        else if (sort === "name-az") {

            filteredProducts.sort(
                (a, b) =>
                    String(a.name)
                        .localeCompare(
                            String(b.name)
                        )
            );

        }

        else if (sort === "name-za") {

            filteredProducts.sort(
                (a, b) =>
                    String(b.name)
                        .localeCompare(
                            String(a.name)
                        )
            );

        }

        else {

            // NEWEST

            filteredProducts.sort(
                (a, b) =>
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
            );

        }

    }


    // ========================================================
    // RENDER PRODUCTS
    // ========================================================

    function renderProducts() {

        productList.innerHTML = "";

        productCount.innerText =
            `${filteredProducts.length} Saree${filteredProducts.length !== 1 ? "s" : ""} Found`;

        if (!filteredProducts.length) {

            noProducts.classList.remove("d-none");

            return;
        }

        noProducts.classList.add("d-none");

        filteredProducts.forEach(
            (product, index) => {

                productList.insertAdjacentHTML(
                    "beforeend",
                    createProductCard(
                        product,
                        index
                    )
                );

            }
        );

        // Refresh AOS after dynamic products are added
        if (typeof AOS !== "undefined") {
            AOS.refresh();
        }
    }


    // ========================================================
    // PRODUCT CARD
    // ========================================================

    function createProductCard(
        product,
        index
    ) {

        const image =
            getProductImage(product);


        const price =
            Number(product.price || 0);


        const oldPrice =
            Number(product.oldPrice || 0);


        const discount =
            oldPrice > price &&
                oldPrice > 0

                ? Math.round(
                    ((oldPrice - price) /
                        oldPrice) * 100
                )

                : 0;


        const stock =
            Number(product.stock || 0);


        let stockBadge = "";


        if (stock === 0) {

            stockBadge = `

                <span class="stock-badge out-stock">

                    Out of Stock

                </span>

            `;

        }

        else if (stock <= 5) {

            stockBadge = `

                <span class="stock-badge low-stock">

                    Only ${stock} left

                </span>

            `;

        }


        return `

            <div class="col-sm-6 col-xl-4">

                <div class="product-card">


                    <!-- IMAGE -->

                    <div class="product-image">

                        ${image
                ? `
                    <img
                        src="${image}"
                        alt="${escapeHTML(product.name)}"
                        loading="lazy"
                        onerror="this.style.display='none';">
                `
                : `
                    <div class="no-product-image">
                        <i class="fa-solid fa-image"></i>
                        <span>No Image Available</span>
                    </div>
                `
            }

                        ${discount > 0

                ? `

                                <span class="discount-badge">

                                    ${discount}% OFF

                                </span>

                              `

                : ""
            }


                        ${stockBadge}


                        <div class="product-overlay">

                            <button
                                type="button"
                                class="quick-view-btn"
                                onclick="viewProduct('${product._id}')">

                                <i class="fa-solid fa-eye"></i>

                            </button>

                        </div>

                    </div>


                    <!-- CONTENT -->

                    <div class="product-content">


                        <span class="product-material">

                            ${escapeHTML(
                product.material ||
                "Saree"
            )}

                        </span>


                        <h3 class="product-name">

                            ${escapeHTML(
                product.name
            )}

                        </h3>


                        <div class="product-details">


                            ${product.occasion

                ? `

                                    <span>

                                        <i class="fa-regular fa-calendar"></i>

                                        ${escapeHTML(
                    product.occasion
                )}

                                    </span>

                                  `

                : ""
            }


                            ${product.color

                ? `

                                    <span>

                                        <i class="fa-solid fa-palette"></i>

                                        ${escapeHTML(
                    product.color
                )}

                                    </span>

                                  `

                : ""
            }


                        </div>


                        <div class="product-price">

                            <strong>

                                ₹${price.toLocaleString("en-IN")}

                            </strong>


                            ${oldPrice > price

                ? `

                                    <del>

                                        ₹${oldPrice.toLocaleString("en-IN")}

                                    </del>

                                  `

                : ""
            }

                        </div>


                        <div class="product-bottom">

                            <span class="blouse-info">

                                <i class="fa-solid fa-shirt"></i>

                                Blouse:
                                ${product.blouseIncluded || "Yes"}

                            </span>


                            ${product.length

                ? `

                                    <span class="length-info">

                                        ${escapeHTML(
                    product.length
                )} m

                                    </span>

                                  `

                : ""
            }

                        </div>


                        <button
                            type="button"
                            class="view-product-btn"
                            onclick="viewProduct('${product._id}')">

                            View Saree

                            <i class="fa-solid fa-arrow-right"></i>

                        </button>


                    </div>

                </div>

            </div>

        `;

    }


    // ========================================================
    // GET PRODUCT IMAGE
    // ========================================================

    function getProductImage(product) {

        if (
            product.images &&
            product.images.length > 0 &&
            product.images[0]
        ) {

            const image = product.images[0];

            if (image.startsWith("http")) {
                return image;
            }

            return `${API_BASE_URL}${image}`;
        }

        return "";
    }


    // ========================================================
    // VIEW PRODUCT
    // ========================================================

    window.viewProduct =
        function (productId) {

            window.location.href =
                `product-details.html?id=${productId}`;

        };


    // ========================================================
    // ESCAPE HTML
    // ========================================================

    function escapeHTML(value) {

        return String(value ?? "")

            .replace(/&/g, "&amp;")

            .replace(/</g, "&lt;")

            .replace(/>/g, "&gt;")

            .replace(/"/g, "&quot;")

            .replace(/'/g, "&#039;");

    }


    // ========================================================
    // LOADING
    // ========================================================

    function showLoading(show) {

        if (show) {

            productLoading.classList.remove(
                "d-none"
            );

        }

        else {

            productLoading.classList.add(
                "d-none"
            );

        }

    }


    // ========================================================
    // FILTER EVENTS
    // ========================================================

    searchInput.addEventListener(
        "input",
        applyFilters
    );


    materialFilter.addEventListener(
        "change",
        applyFilters
    );


    occasionFilter.addEventListener(
        "change",
        applyFilters
    );


    colorFilter.addEventListener(
        "change",
        applyFilters
    );


    blouseFilter.addEventListener(
        "change",
        applyFilters
    );


    minPrice.addEventListener(
        "input",
        applyFilters
    );


    maxPrice.addEventListener(
        "input",
        applyFilters
    );


    sortFilter.addEventListener(
        "change",
        applyFilters
    );


    // ========================================================
    // RESET FILTERS
    // ========================================================

    function resetAllFilters() {

        searchInput.value = "";

        materialFilter.value = "";

        occasionFilter.value = "";

        colorFilter.value = "";

        blouseFilter.value = "";

        minPrice.value = "";

        maxPrice.value = "";

        sortFilter.value = "newest";


        applyFilters();

    }


    resetFilters.addEventListener(
        "click",
        resetAllFilters
    );


    if (resetFiltersEmpty) {

        resetFiltersEmpty.addEventListener(
            "click",
            resetAllFilters
        );

    }


    // ========================================================
    // START
    // ========================================================

    loadProducts();

});