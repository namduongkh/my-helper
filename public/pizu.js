(function() {
    "use strict";

    angular.module('Pizu', ["ngAnimate", "toastr"])
        .controller('PizuController', function($timeout, $scope, $http, toastr) {
            var pizu = this;
            pizu.order_count = 1;

            pizu.changeOrderCount = function(inc) {
                if (!pizu.default_price) {
                    pizu.default_price = $('#product_price_text').find('.item_price').text();
                    pizu.default_price = pizu.default_price.replace(/(.+)K/g, '$1');
                }
                if (inc) {
                    pizu.order_count++;
                } else {
                    pizu.order_count--;
                }
                if (pizu.order_count > 5) {
                    pizu.order_count = 5;
                }
                if (pizu.order_count < 1) {
                    pizu.order_count = 1;
                }
                var price = Number(pizu.default_price) * pizu.order_count + 'K';
                $('#product_price_text').find('.item_price').text(price);
            };

            $timeout(function() {
                $('.item_add').unbind();
            }, 1000);

            pizu.openOrderForm = function() {
                var name = $('#product_name_text').text();
                var price = $('#product_price_text').find('.item_price').text();
                if (!name || !price) {
                    return;
                }
                pizu.order = {
                    product_name: name,
                    product_price: price
                };
                $.magnificPopup.open({
                    items: {
                        src: "#order-form"
                    },
                    fixedContentPos: true
                });
            };

            pizu.confirmOrder = function(valid) {
                pizu.submitted = true;
                if (!valid || !pizu.order.user_address) {
                    toastr.error('Thông tin đặt hàng chưa hợp lệ!', 'Lỗi!');
                    return;
                }
                pizu.submitting = true;
                $http({
                        method: 'post',
                        url: 'https://www.bidy.vn/api/testSendEmail',
                        data: {
                            sender: {
                                user: 'openness.sender.email@gmail.com',
                                pass: 'phongnguyen.94'
                            },
                            send_from: pizu.order.user_email || 'openness.sender.email@gmail.com',
                            send_to: 'namduong.kh94@gmail.com',
                            subject: 'Đơn đặt hàng ' + pizu.order.product_name + ' ' + new Date().toLocaleString(),
                            content: `Mặt hàng: ${pizu.order.product_name}, Số lượng: ${pizu.order_count}, Giá: ${pizu.order.product_price}, Họ tên: ${pizu.order.user_name}, Điện thoại: ${pizu.order.user_phone}, Địa chỉ: ${pizu.order.user_address}, Email: ${pizu.order.user_email || ''}, Ghi chú: ${pizu.order.user_note || ''}`
                        }
                    })
                    .then(function(resp) {
                        console.log('resp', resp);
                        if (resp.status == 200 && resp.data) {
                            toastr.success('Đặt hàng thành công, đơn hàng đang được xử lý', 'Thành công!');
                            $.magnificPopup.close();
                        } else {
                            toastr.error('Có lỗi xảy ra, liên hệ 01262346655 để được hỗ trợ!', 'Lỗi!');
                        }
                        pizu.submitted = false;
                        pizu.submitting = false;
                    })
                    .catch(function() {
                        toastr.error('Có lỗi xảy ra, liên hệ 01262346655 để được hỗ trợ!', 'Lỗi!');
                        pizu.submitted = false;
                        pizu.submitting = false;
                    });
            };
        });
})();