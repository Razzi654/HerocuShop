import * as utils from "../../common/static/js/utilFunctions.mjs";

const sortName = {
  DateDesc: "От новых до старых",
  DateAsc:  "От старых до новых",
  ScoreDesc: "Высокие оценки",
  ScoreAsc: "Низкие оценки",
};

const pageNames = {
  reviewsCount: "Отзывов",
  reviews: "Отзывы",
  menuItems: ["Обзор", "Отзывы"],
  specefications: "Краткие характеристики",
  quantity: "Количество",
  price: "Цена",
  buy: "Купить",
  expand: "Развернуть",
  collapse: "Свернуть",
  description: "Описание",
  specifications: "Характеристики",
  ratingStarTitle: "Нажмите на звезду, чтобы поставить оценку товару",
  reviewTitle: "Напишите свой отзыв",
  saveReviewBtn: "Отправить отзыв",
}

/**
 * 
 * @param {{
 *   Name: string;
 *   TotalScore: number;
 *   maxScore: number;
 *   reviewsCount: number;
 *   color: {name: string; color: string;};
 *   memorySize: string;
 *   Price: number;
 *   regularPrice: number;
 *   Description: string;
 *   Photo: string[];
 *   Comments: {name: string; score: number; maxScore: number;  datetime: Date; commentText: string;}[];
 * }} data 
 */
const buildProductPage = (data) => {
  const section = d3.select("main section");
  const container = section.append("div").classed("container", true);

  section.style("margin-top", `${utils.getElementHeight(d3.select("header nav"))}px`);

  const userPlaceholderImg = "/common/static/img/Portrait_Placeholder.png";

  const clearContainer = () => container.selectChildren(":not(.page-title-block)").remove();

  const pageTitle = () => {
    const { Name } = data;
    const pageTitleBlock = container.append("div").classed("page-title-block", true).style("padding-top", "1rem");
    const title = pageTitleBlock.append("h1").classed("page-title", true).text(Name);

    const subtitle = () => {
      const subtitleBlock = pageTitleBlock
        .append("div")
        .classed("subtitle-block", true)
        .style("padding-top", "1rem")
        .style("height", "100%");

      const productRating = subtitleBlock
        .append("div")
        .classed("row flex-m product-rating", true)
        .style("max-width", "15rem")
        .lower();

      const ratingStar = () => {
        const { TotalScore, maxScore, Comments } = data;

        const getRating = () => TotalScore.toFixed(1);
        const getReviews = () => `${pageNames.reviewsCount} ${Comments.length}`;

        const ratingStar = productRating
          .append("div")
          .classed("col-2 product-rating-star", true)
          .style("font-size", "1.4rem")
          .style("color", "#ffa900");

        const ratingItem = productRating.append("div").classed("col-auto product-rating-item", true);
        const ratingReviews = productRating.append("div").classed("col-auto product-rating-reviews", true);

        ratingStar.append("i").classed("fa fa-star", true).attr("aria-hidden", "true");

        ratingItem.append("span").append("strong").text(getRating);
        ratingItem.append("span").text("/" + maxScore);

        ratingReviews.append("a").attr("href", "#").text(getReviews)
      };

      ratingStar();
    };

    const pageMenu = () => {
      const { menuItems } = pageNames;
      const menu = pageTitleBlock
        .append("div")
        .classed("reviews-style", true)
        .style("padding", "0.4rem 0")
        .append("div")
        .classed("reviews-menu", true)
        .append("ul")
        .classed("nav", true);

      utils.createSelection(menu, menuItems, "li")
        .append("a")
        .classed("active", item => item === menuItems.at(0))
        .attr("href", "#")
        .text(item => item)
        .on("click", function (event, item) {
          event.preventDefault();
          menu.selectAll("a").classed("active", false);
          d3.select(this).classed("active", true);

          switch (item) {
            case menuItems.at(0):
              productDetails();
              break;
            case menuItems.at(1):
              reviews();
              break;
            default:
              break;
          }
        });
    };

    subtitle();
    pageMenu();
  };

  const productDetails = () => {
    clearContainer();

    const productSection = () => {
      const section = container.append("div").classed("product-section shadow-sm product-details-style-2 bg-white", true);
      const row = section.append("div").classed("row", true);

      const productDetailsImage = () => {
        const detailsImage = row
          .append("div")
          .classed("col-lg-6", true)
          .append("div")
          .classed("product-details-image", true);

        const { Photo } = data;

        const productImage = () => {
          const productImage = detailsImage.append("div").classed("product-image", true);
          const active = productImage
            .append("div")
            .classed("product-image-active tab-content", true)
            .attr("id", "v-pills-tabContent-2");

          const imgSrc = (image) => utils.correctImgPath(image);

          const singleImagePane = (parent) => {
            const id = "v-pills";
            const classNames = "single-image tab-pane fade flex-c-m";

            const getId = (i) => `${id}-${i + 6}`;

            const singleImage = parent
              .attr("id", (_, i) => getId(i))
              .attr("class", (_, i) => `${classNames} ${i === 0 ? "active show" : ""}`)
              .attr("role", "tabpanel")
              .attr("aria-labelledby", (_, i) => `${getId(i)}-tab`);

            singleImage
              .append("img")
              .attr("src", imgSrc)
              .attr("loading", "lazy")
              .style("width", "auto")
              .style("max-width", "100%")
              .style("max-height", "100%");
          };

          utils.createSelection(active, Photo, "div").call(singleImagePane);
        };

        const productThumbImage = () => {
          const productThumbImage = detailsImage.append("div").classed("product-thumb-image", true);
          const active = productThumbImage
            .append("div")
            .classed("product-thumb-image-active nav nav-pills flex-c-m", true)
            .attr("id", "v-pills-tab-2")
            .attr("role", "tablist")
            .attr("aria-orientation", "vertical");

          const imgSrc = (image) => utils.correctImgPath(image);

          const singleThumb = (parent) => {
            const id = "v-pills";
            const classNames = "single-thumb";

            const getId = (i) => `${id}-${i + 6}`;

            const singleImage = parent
              .attr("id", (_, i) => `${getId(i)}-tab`)
              .attr("class", (_, i) => `${classNames} ${i === 0 ? "active" : ""}`)
              .attr("role", "tab")
              .attr("data-bs-toggle", "pill")
              .attr("aria-selected", (_, i) => i === 0)
              .attr("aria-controls", (_, i) => getId(i))
              .attr("href", (_, i) => `#${getId(i)}`)
              .style("padding", "5px")
              .style("width", "5rem");

            singleImage.append("img").attr("src", imgSrc).attr("loading", "lazy");
          };

          utils.createSelection(active, Photo, "div").call(singleThumb);
        };

        productImage();
        productThumbImage();
      };


      const productDetailsContent = () => {
        const detailsContent = row
          .append("div")
          .classed("col-lg-6", true)
          .append("div")
          .classed("product-details-content", true)
          .style("margin-top", "2.5rem");

        const productItems = () => {
          const { Description } = data;
          const item = detailsContent.append("div").classed("product-items flex-wrap", true);
          const title = item.append("h6").classed("item-title", true).text(pageNames.specefications);
          const itemsWrapper = item
            .append("div")
            .classed("items-wrapper text-truncate", true)
            .style("margin-top", "1.5rem")
            .attr("id", "select-item-2")
            .text(Description.slice().split(" /").join("; "));
        };

        const productSelectWrapper = () => {
          const wrapper = detailsContent.append("div").classed("product-select-wrapper flex-wrap", true);

          const selectQuantity = () => {
            const select = wrapper.append("div").classed("select-item", true);
            const title = select.append("h6").classed("select-title", true).text(`${pageNames.quantity}:`);

            const quantitySelect = select.append("div").classed("select-quantity", true);

            const sub = quantitySelect.append("button").classed("sub", true).attr("id", "sub");
            sub.append("i").classed("fa fa-minus", true).attr("aria-hidden", "true");

            const quantity = quantitySelect.append("input").attr("type", "text").attr("id", "product-quantity").attr("value", 1);

            const add = quantitySelect.append("button").classed("add", true).attr("id", "add");
            add.append("i").classed("fa fa-plus", true).attr("aria-hidden", "true");

            sub.on("click", () => {
              const value = parseInt(quantity.property("value"));
              if (value > 1) {
                quantity.property("value", value - 1);
              }
            });
            add.on("click", () => {
              const value = parseInt(quantity.property("value"));
              if (value < 999) {
                quantity.property("value", value + 1);
              }
            });
          };

          selectQuantity();
        };

        const productPrice = () => {
          const { Price, regularPrice } = data;

          const price = (price) => utils.spaceSeparatedNum(price) + utils.moneySymbol;

          const item = detailsContent.append("div").classed("product-price", true);
          const title = item.append("h6").classed("price-title", true).text(`${pageNames.price}:`);
          item.append("div").classed("sale-price", true).text(price(Price));

          if (regularPrice) {
            item.append("div").classed("regular-price", true).text(price(regularPrice));
          }
        };

        const productBtn = () => {
          const toastContainer = d3.select(".toast-container");
          const toast = toastContainer.select(".toast").style("width", "250px");

          const item = detailsContent.append("div").classed("product-btn", true);
          const button = item
            .append("button")
            .classed("main-btn secondary-1-btn", true)
            .style("background-color", "#bd476d")
            .on("click", () => {
              const { _id: productID, Name, Price, Photo } = data;

                const shoppingCart = utils.ShoppingCart.get() || [];
                const productFound = shoppingCart.some(item => item.id === productID);

                const quantity = parseInt(detailsContent.select("#product-quantity").property("value"));

                shoppingCart.forEach(item => {
                    if (item.id === productID) {
                        item.itemsAmount+=quantity;
                    }
                });

                if (!productFound) {
                    shoppingCart.push({
                        id: productID,
                        name: Name,
                        price: Price,
                        img: Photo[0],
                        itemsAmount: quantity
                    });
                }

                utils.ShoppingCart.set(shoppingCart);

                const newToast = d3.select("main section").append(() => toast.clone(true).node());
                new bootstrap.Toast(newToast.node()).show();
                setTimeout(() => newToast.remove(), 5000);
            });
          button.append("i").classed("bx bx-cart-add", true).attr("aria-hidden", "true");
          button.append("span").text(pageNames.buy);
        };

        productItems();
        productSelectWrapper();
        productPrice();
        productBtn();
      };

      productDetailsImage();
      productDetailsContent();
    };

    const descriptionSection = () => {
      const {Description} = data;
      const section = container.append("div").classed("description-section bg-white shadow-sm", true);
      const row = section.append("div").classed("row row-cols-1 row-cols-lg-2", true);

      const descriptionBlock = () => {
        const descriptionBlock = row
          .append("div")
          .classed("col-lg-6 border-end mb-5", true)
          .append("div")
          .classed("row row-cols-1", true);

        const createBlock = (type, height, titleText, contentText) => {
          const block = descriptionBlock.append("div").classed("col col-12", true);
          const title = block.append("div").classed(`${type}-title`, true).append("h3").text(titleText).classed(`title`, true);

          const content = block
            .append("div")
            .classed(`${type}-content`, true)
            .style("transition", "all 0.5s ease")
            .style("overflow", "hidden")
            .style("line-height", "2")
            .style("margin-top", "1rem")
            .style("min-height", "4rem")
            .style("height", height);

          let text;
          if (Array.isArray(contentText)) {
            text = utils.createSelection(content, contentText, "div").text((text) => `${text};`);
          } else {
            text = content.append("div").text(contentText);
          }

          const expandBtn = block
            .append("div")
            .classed("expand-btn", true)
            .classed("d-none", utils.getElementHeight(content) >= utils.getElementHeight(text) * text.size())
            .style("margin-top", "1rem")
            .append("button")
            .classed("main-btn primary-btn", true)
            .style("font-size", "0.75rem")
            .text(pageNames.expand);

          let clicked = false;
          expandBtn.on("click", () => {
            if (clicked) {
              content.style("height", height);
              expandBtn.text(pageNames.expand);
            } else {
              content.style("height", `${utils.getElementHeight(text) * text.size()}px`);
              expandBtn.text(pageNames.collapse);
            }
            clicked = !clicked;
          });

          return block;
        };

        const specifications = () => {
          const contentText = Description.slice().split(" /");
          createBlock("specifications", "20rem", pageNames.specifications, contentText).style("padding-top", "2rem");
        };
        
        specifications();
      };

      const reviewsBlock = () => {
        const { Comments } = data;
        const maxComments = 5;

        Comments.sort((a, b) => b.datetime.valueOf() - a.datetime.valueOf());
        
        const getName = (comment) => comment.username;
        const getScore = (comment) => comment.score.toFixed(1);
        const getMaxScore = (comment) => `/${comment.maxScore}`;
        const getDatetime = (comment) => comment.datetime.toLocaleString();
        const getCommentText = (comment) => comment.commentText;

        const reviewsBlock = row
          .append("div")
          .classed("col-lg-6 mb-5", true)
          .append("div")
          .classed("row row-cols-1", true);

        const title = reviewsBlock.append("div").classed("reviews-title", true).append("h3").text(pageNames.reviews).classed(`title`, true);

        const reviewsStyle = reviewsBlock.append("div").classed("reviews-style", true);
        const reviewsComment = reviewsStyle.append("div").classed("reviews-comment", true);

        const commentItems = () => {
          const commentItems = reviewsComment.append("ul").classed("comment-items", true);

          const singleComment = (parent) => {
            const singleReviewComment = parent.append("div").classed("single-review-comment", true);

            const commentUserInfo = () => {
              const commentUserInfo = singleReviewComment.append("div").classed("comment-user-info", true);
              const commentAuthor = commentUserInfo.append("div").classed("comment-author", true).style("width", "3rem");

              commentAuthor
                .append("img")
                .attr("src", userPlaceholderImg)
                .attr("loading", "lazy")
                .style("border-radius", "50%");

              const commentContent = commentUserInfo.append("div").classed("comment-content", true);
              const username = commentContent.append("h6").classed("name", true).text(getName);

              const subtitle = commentContent.append("p");
              const star = subtitle.append("i").classed("fa fa-star", true).attr("aria-hidden", "true");
              const rating = subtitle.append("span").classed("rating", true).style("margin-left", "0.3rem");
              rating.append("span").append("strong").text(getScore);
              rating.append("span").text(getMaxScore);

              subtitle.append("span").classed("date", true).text(getDatetime);
            };

            const commentUserText = () => {
              const commentUserText = singleReviewComment.append("div").classed("comment-user-text", true);
              commentUserText
                .append("p")
                .style("line-height", 1.5)
                .style("font-size", "0.93rem")
                .style("color", "rgba(0, 0, 0, 0.8)")
                .text(getCommentText);
            };

            commentUserInfo();
            commentUserText();
          };

          utils.createSelection(commentItems, Comments.slice(0, maxComments), "li").call(singleComment);
        };

        commentItems();
      };
      
      descriptionBlock();
      reviewsBlock();
    };

    productSection();
    descriptionSection();
  };

  const reviews = () => {
    clearContainer();
    
    const { maxScore, Comments } = data;
    const reviewsContainer = container.append("div").classed("reviews-style", true);

    const reviewsRating = () => {
      const reviewsRating = reviewsContainer.append("div").classed("reviews-rating-wrapper flex-wrap", true);
      const scoresLayout = new Array(maxScore).fill(null).map((_, i) => i + 1);

      const reviewsRatingStar = () => {
        const reviewsRatingStar = reviewsRating.append("div").classed("reviews-rating-star", true);

        const ratingBars = () => {
          const scores = Comments.map(({ score, maxScore }) => { return { score, maxScore } });
          const accessor = (comment) => comment.score;
          const groupedScores = d3.group(scores, accessor);

          const ratingBar = (parent) => {
            const percent = (score) => {
              const actualScores = groupedScores.get(score);
              if (actualScores) {
                return `${Math.round(actualScores.length / scores.length * 100)}%`;
              }
              return "0%";
            };
            parent.classed("reviews-rating-bar", true);
            const singleBar = parent.append("div").classed("single-reviews-rating-bar", true);
            const p = singleBar.append("p").classed("value", true);
            p.append("i").classed("fa fa-star", true).attr("aria-hidden", true).style("margin-right", "0.2rem");
            p.append("span").text(score => score);
            singleBar
              .append("div")
              .classed("rating-bar-inner", true)
              .append("div")
              .classed("bar-inner", true)
              .style("width", percent);
            singleBar.append("p").classed("percent", true).text(percent);
          };

          utils
            .createSelection(reviewsRatingStar, scoresLayout, "div", ".reviews-rating-bar")
            .call(ratingBar)
            .sort((a, b) => d3.descending(a, b));
        };


        ratingBars();
      };

      const reviewsRatingForm = () => {
        const reviewsRatingForm = reviewsRating.append("div").classed("reviews-rating-form", true);

        const ratingStar = () => {
          const unselectedColor = "#7D7D7D";
          const selectedColor = "#FFA900";

          const ratingStar = reviewsRatingForm.append("div").classed("rating-star", true);
          ratingStar.append("p").text(pageNames.ratingStarTitle);
          const stars = ratingStar.append("ul").classed("stars", true).attr("id", "stars");
          const star = utils.createSelection(stars, scoresLayout, "li")
            .classed("star", true)
            .attr("data-value", score => score)
            .style("padding-right", "0.2rem")
            .style("color", unselectedColor);

          star.append("i").classed("fa fa-star", true).attr("aria-hidden", "true");

          star.on("click", (_, chosenScore) => {
            const chosenStar = star.filter((score) => score === chosenScore);
            chosenStar
              .classed("active", !chosenStar.classed("active"))
              .style("color", selectedColor);

            star.filter((score) => score < chosenScore)
              .classed("active", false)
              .style("color", selectedColor);
            star.filter((score) => score > chosenScore)
              .classed("active", false)
              .style("color", unselectedColor);
          });
        };

        const ratingForm = () => {
          const ratingForm = reviewsRatingForm.append("div").classed("rating-form", true);
          const form = ratingForm.append("form");
          const formDefault = form.append("div").classed("single-form form-default", true);
          formDefault.append("label").text(pageNames.reviewTitle);
          const formInput = formDefault.append("div").classed("form-input", true);
          const textarea = formInput.append("textarea").attr("placeholder", `${pageNames.reviewTitle}`);
          formInput.append("i").classed("bx bx-message-dots", true).attr("aria-hidden", "true");

          const singleForm = form.append("div").classed("single-rating-form flex-wrap", true);
          singleForm.append("div")
            .classed("rating-form-btn", true)
            .append("button")
            .classed("main-btn primary-btn", true)
            .text(pageNames.saveReviewBtn);

          form.on("submit", (event) => {
            event.preventDefault();
            event.stopPropagation();
            const chosenStar = reviewsRatingForm.select("#stars .star.active");
            const data = {
              username: "",
              productId: utils.ProductId.get(),
              score: parseInt(chosenStar.empty() ? 1 : chosenStar.attr("data-value")),
              maxScore: 5,
              commentText: utils.escapeString(textarea.property("value")),
              datetime: Date.now()
            };

            utils.sendCommentData(data);
          });
        };

        ratingStar();
        ratingForm();
      };

      reviewsRatingStar();
      reviewsRatingForm();
    };

    const sortButtons = () => {
      const reviewsBtns = reviewsContainer
        .append("div")
        .classed("reviews-btn flex-wrap", true)
        .append("div")
        .classed("reviews-btn-left", true);

      const dropdown = reviewsBtns
        .append("div")
        .classed("dropdown-style", true)
        .append("div")
        .classed("dropdown dropdown-white", true);

      const select = dropdown
        .append("select")
        .classed("main-btn primary-btn-border form-select", true)
        .style("width", "fit-content")
        .style("padding-right", "2.2rem");

      select.append("option").attr("value", "DateDesc").text(sortName["DateDesc"]);
      select.append("option").attr("value", "DateAsc").text(sortName["DateAsc"]);
      select.append("option").attr("value", "ScoreDesc").text(sortName["ScoreDesc"]);
      select.append("option").attr("value", "ScoreAsc").text(sortName["ScoreAsc"]);
    };

    const reviewsComments = () => {
      const commentContainer = reviewsContainer.append("div").classed("reviews-comment", true);
      const commentItems = commentContainer.append("ul").classed("comment-items", true);
      
      const createSingleComment = (parent) => {
        const commentUserInfo = parent
          .append("div")
          .classed("single-review-comment", true)
          .append("div")
          .classed("comment-user-info", true);

        const commentAuthor = commentUserInfo.append("div").classed("comment-author", true);

        commentAuthor
          .append("img")
          .attr("src", userPlaceholderImg)
          .attr("loading", "lazy")
          .style("height", "3rem")
          .style("border-radius", "50%");

        const commentContent = commentUserInfo.append("div").classed("comment-content", true);
        commentContent.append("h6").classed("name", true).text(comment => comment.username);

        const p = commentContent.append("p");
        p.append("i").classed("fa fa-star", true).attr("aria-hidden", true);
        const rating = p.append("span").classed("rating", true);
        rating.append("span").append("strong").text(comment => comment.score);
        rating.append("span").text(comment => `/${comment.maxScore}`);
        p.append("span").classed("date", true).text(comment => comment.datetime.toLocaleString());


        const commentUserText = parent.append("div").classed("comment-user-text", true);
        commentUserText.append("p").text(comment => comment.commentText);

        parent.order();
      };

      Comments.sort((a, b) => b.datetime.valueOf() - a.datetime.valueOf());
      utils.createSelection(commentItems, Comments, "li").call(createSingleComment);

      const select = reviewsContainer.select("select.main-btn.primary-btn-border.form-select");
      select.on("change", () => {
        const value = select.property("value");

        utils.clear(commentItems);

        switch (value) {
          case "DateDesc":
            Comments.sort((a, b) => b.datetime.valueOf() - a.datetime.valueOf());
            break;
          case "DateAsc":
            Comments.sort((a, b) => a.datetime.valueOf() - b.datetime.valueOf());
            break;
          case "ScoreDesc":
            Comments.sort((a, b) => b.score - a.score);
            break;
          case "ScoreAsc":
            Comments.sort((a, b) => a.score - b.score);
            break;
          default:
            break;
        }

        utils.createSelection(commentItems, Comments, "li").call(createSingleComment);
      });
    };

    reviewsRating();
    sortButtons();
    reviewsComments();
  };

  pageTitle();
  productDetails();
};


document.addEventListener("DOMContentLoaded", () => {
  utils.getProductData().then(data => {
    data.maxScore = 5;
    data.Comments.forEach(c => c.datetime = new Date(c.datetime));
    data.TotalScore = d3.mean((data.Comments.map(c => c.score))) || 0;
    buildProductPage(data);
  });
});
