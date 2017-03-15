/**
 * Created by Desster on 17.12.2015.
 */
'use strict';

angular.module('angularApp')
  .controller('BookViewCtrl', function ($scope, $http, $window, $location, authorization,
                                        FileUploader, config, pageTitle, utils, confirmDialog,
                                        $rootScope, elBooks) {
    var code = $location.search().code;
    $scope.gallery = {images: [], opts: "", show: false};
    $scope.cropSelection = {src:"", selection: [], thumbnail: false};
    $scope.absUrl = $location.absUrl();

    $scope.bookFormats = ['.pdf', '.epub', '.fb2', '.mobi'];
    $scope.bookTypes = ['fragment', 'book'];
    $scope.selectors = {};

    $scope.uploader = new FileUploader({
      url: config.url() + '/api/edit/books/banner_upload',
      removeAfterUpload: true,
      withCredentials: true
    });
    var uploader = $scope.uploader;
    uploader.filters.push({
      name: 'imageFilter',
      fn: function(item /*{File|FileLikeObject}*/, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    var wayForPay = new Wayforpay();

    if(authorization.isAuthorized()){
       $scope.user = authorization.getUser();
    }

    $rootScope.$on('successful_authorization', function () {
       $scope.user = authorization.getUser();
    })

    $rootScope.$on('el_books_has_added', function () {
      if($scope.book !== undefined){
        $scope.elBookLink = elBooks.GetElBookLink($scope.book.code);
        if (authorization.isAuthorized()){
          $http.get(config.url() + '/api/user/files_for_book/get_file_formats_by_code?code=' + $scope.book.code, {withCredentials: true})
            .success(function (response) {
              $scope.existedFormats = response;
            })
        }
      }
    })

    $scope.SaveOrder = function (book) {
      function successAdded(response) {
          $scope.completedOrder = response;
          $scope.savingInProgress = false;
          if ($scope.completedOrder === undefined) {
            return;
          }
          $scope.completedOrder.hash = utils.GetRandomNumber();
          $http.post(config.url() + "/api/user/orders/get_order_signature", $scope.completedOrder, {withCredentials: true})
          .success(function (response) {
            $scope.completedOrder.signature = response;
            $scope.WayForPay($scope.completedOrder);
          })
      }
      var orderAmount, goodsTable = [];
      if (!book.priceElBook > 0){
         return;
      }
      $scope.savingInProgress = true;
      orderAmount = book.priceElBook;
      var book = {code: book.code, quantity: 1, price: book.priceElBook, discount: 0, name: book.name, preorder: false};
      goodsTable.push(book);
      $scope.orderState = 'Зроблений';
      var orderUpdate = {id: 0,
        type:          'Електронна',
        username:      authorization.username(),
        name:          $scope.user.name,
        phone:         $scope.user.phone,
        email:         authorization.username(),
        address:       $scope.user.address,
        orderState:    $scope.orderState,
        orderAmount:   orderAmount,
        deliveryCost:  0,
        totalAmount:   orderAmount,
        goodsTable:    goodsTable};
      //if (authorization.isAuthorized()) {
        $http.post(config.url() + "/api/user/orders/update", orderUpdate, {withCredentials: true})
          .success(function(response) {
            successAdded(response);
          })
     // }else{
     //   $http.post(config.url() + "/api/orders/update", orderUpdate)
     //     .success(function(response) {
     //       successAdded(response);
     //     })
     // }
    }

    $scope.WayForPay = function (order) {
      function getGoodsNames(goodsTable) {
        var goodsNames = [];
        angular.forEach(goodsTable, function (goodsItem, key) {
          goodsNames.push(goodsItem.name);
        })
        return goodsNames;
      }
      function getGoodsPrices(goodsTable) {
        var goodsPrices = [];
        angular.forEach(goodsTable, function (goodsItem, key) {
          goodsPrices.push(parseFloat(goodsItem.price));
        })
        return goodsPrices;
      }
      function getGoodsCounts(goodsTable) {
        var goodsCounts = [];
        angular.forEach(goodsTable, function (goodsItem, key) {
          goodsCounts.push(parseInt(goodsItem.quantity, 10));
        })
        return goodsCounts;
      }
      wayForPay.run({
          merchantAccount : "kmbooks_com_ua1",
          merchantDomainName : "kmbooks.com.ua",
          merchantTransactionSecureType: "AUTO",
          authorizationType : "SimpleSignature",
          serviceUrl:     'https://api.kmbooks.com.ua/api/orders/pay_confirm',
          merchantSignature : order.signature,
          orderReference : order.number + '-' + order.hash,
          orderDate : utils.toUnixTime(order.id),
          amount : order.totalAmount,
          currency : "UAH",
          language: "UA",
          productName: getGoodsNames(order.goodsTable),
          productPrice: getGoodsPrices(order.goodsTable),
          productCount: getGoodsCounts(order.goodsTable),
          clientFirstName : $scope.user.name,
          clientLastName : $scope.user.name,
          clientEmail : $scope.user.email,
          clientPhone: '38' + $scope.user.phone
        },
        function (response) {
          // on approved
          $http.post(config.url() + "/api/orders/pay_confirm", response)
            .success(function(response) {
               elBooks.GetStoredElBooks();
            });//
        },
        function (response) {
          // on declined
          //alert(response);
        },
        function (response) {
          // on pending or in processing
          alert(response);
        })
    }

    $scope.BuyElBook = function (book) {
      if (!authorization.isAuthorized()) {
        confirmDialog.ShowRegistrationConfirm('Для придбання електронних книг будь ласка зарееструйтесь');
        return;
      }
      $scope.SaveOrder(book);
    }

    $scope.editItem = function (item) {
      item.editing = true;
      $http.get(config.url() + '/api/edit/files_for_book/get_file_names_by_code?code=' + $scope.book.code, {withCredentials: true})
        .success(function (response) {
          $scope.existedFiles = response;
        })
    }

    $scope.saveItem = function (item) {
      $scope.bannerSaving = true;
      item.upl_item.formData[0].rectangle = [$scope.cropSelection.selection[0],
        $scope.cropSelection.selection[1],
        $scope.cropSelection.selection[4],
        $scope.cropSelection.selection[5]];
      item.upl_item.upload();
    }

    uploader.onAfterAddingFile = function(fileItem) {
       $scope.book.upl_item = fileItem;
    };

    uploader.onSuccessItem = function(fileItem, response, status, headers) {
      $scope.bannerSaving = false;
       $scope.bannerImage = response.image;
       $scope.book.upl_item = null;
    };

    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
      $scope.bannerSaving = false;
      alert("Ошибка добавления файла, разрешены только изображения");
    };

    uploader.onErrorItem = function(fileItem, response, status, headers) {
      $scope.bannerSaving = false;
      $scope.book.upl_item = null;
      alert("При загрузке файла на сервер возникла ошибка");
    };

    $http.get(config.url() + '/api/books/search?code=' + code)
      .success(function (response) {
        $scope.book = response.bookList[0];
        pageTitle.SetTitle($scope.book.name + ' купити книгу в Києві і Україні.');
        pageTitle.SetDescription('Інтернет-магазин kmbooks.com.ua: ' + $scope.book.name + '. Автор: ' + $scope.book.author
                         + '. Доставка: Киев, Украина. ' + $scope.book.description);
        $scope.elBookLink = elBooks.GetElBookLink($scope.book.code);
        if (authorization.isAuthorized()){
          $http.get(config.url() + '/api/user/files_for_book/get_file_formats_by_code?code=' + $scope.book.code, {withCredentials: true})
            .success(function (response) {
              $scope.existedFormats = response;
            })
        }
      })

    $http.get(config.url() + '/api/books/images?code=' + code)
      .success(function (response) {
        angular.forEach(response, function (image, key) {
            if (image.flat === true) {
              $scope.flatImageIndex = key;
              $scope.flatImage = image.src.replace('.jpg', '_big.jpg');
            }
            $scope.gallery.images[key] = {
              srcThumbNail: image.src.replace('.jpg', '_big.jpg'),
              flat: image.flat,
              src: image.src.replace('.jpg', '_original.jpg'),
              w: image.width,
              h: image.height
            };
        })
        if ($scope.flatImage === undefined){
          angular.forEach(response, function (image, key) {
            if (image.main === true) {
              $scope.flatImageIndex = key;
              $scope.flatImage = image.src.replace('.jpg', '_big.jpg');
            }
          })
        }
        var bannerHeight = angular.element('#bookBanner').height();
        var offset = 10;
        //if (bannerHeight > 250) {
        //  offset = 10;
        //}
        var flatImageHeight = bannerHeight - 60 - offset + bannerHeight/8;
        $scope.flatImageHeight={height: flatImageHeight};
      })

    $http.get(config.url() + '/api/books/banner_book?code=' + code)
      .success(function (response) {
        if (response.image === null) {
          $scope.bannerImage = '/img/pics/' + code + '_banner.jpg';
        }else{
          $scope.bannerImage = response.image;
        };
      })

    $http.get(config.url() + '/api/books/description?code=' + code)
      .success(function (response) {
        $scope.description = response.text.replace(/([^>])\n/g, '$1<br/>'); //nl2br
      })

    $http.get(config.url() + '/api/news/get_news_by_code_book?code=' + code)
      .success(function (response) {
        $scope.news = response;
      })

    $http.get(config.url() + '/api/files_for_book/get_by_code?code=' + code)
      .success(function (response) {
        $scope.bookFragment = response;
      })

    $scope.gallery.opts = {
      index: 0,
      history: false,
      bgOpacity: 0.5
    };

    $scope.showGallery = function (i) {
      $scope.gallery.opts.index = i;
      $scope.gallery.show = true;
    };

    $scope.closeGallery = function () {
      $scope.gallery.show = false;
    };

    $scope.isEditor = function() {
      return authorization.isEditor();
    }

    $scope.uploaderFile = new FileUploader({
      url: config.url() + '/api/edit/files_for_book/upload',
      removeAfterUpload: true,
      withCredentials: true
    });
    var uploaderFile = $scope.uploaderFile;

    $scope.saveFileItem = function (item) {
      $scope.fileSaving = true;
      item.upl_itemFile.formData[0].type = $scope.selectors.bookType;
      item.upl_itemFile.formData[0].format = $scope.selectors.bookFormat;
      item.upl_itemFile.upload();
    }

    uploaderFile.onAfterAddingFile = function(fileItem) {
      $scope.book.upl_itemFile = fileItem;
    };

    uploaderFile.onSuccessItem = function(fileItem, response, status, headers) {
      $http.get(config.url() + '/api/edit/files_for_book/get_file_names_by_code?code=' + $scope.book.code, {withCredentials: true})
        .success(function (response) {
          $scope.existedFiles = response;
        })
      $scope.fileSaving = false;
      $scope.bookFragment = response;
      $scope.book.upl_itemFile = null;
    };

    uploaderFile.onErrorItem = function(fileItem, response, status, headers) {
      $scope.fileSaving = false;
      $scope.book.upl_itemFile = null;
      alert("При загрузке файла на сервер возникла ошибка");
    };

    $scope.OpenFragment = function (url) {
      $window.open('http://kmbooks.com.ua' + url);
    }

    $scope.DownloadElBook = function (elBookLink, bookFormat) {
      $window.open('http://api.kmbooks.com.ua/api/user/files_for_book/get_el_book?link=' + elBookLink + '&format=' + bookFormat, {withCredentials: true});
    }

  });
