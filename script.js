/**
 * مخبز قمح وزعتر - المعادي | Daqiq & Zaatar Bakery Maadi
 * JavaScript (script.js) - تفاعلية الصفحة والطلب عبر واتساب
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. رقم هاتف المخبز على واتساب (يمكن تعديله بسهولة)
    const WHATSAPP_PHONE = '201012345678';

    // 2. التحكم في القائمة على الموبايل (Mobile Navigation Menu)
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navIcon = navToggle ? navToggle.querySelector('i') : null;

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('open');
            if (navIcon) {
                if (isOpen) {
                    navIcon.classList.remove('fa-bars');
                    navIcon.classList.add('fa-xmark');
                } else {
                    navIcon.classList.remove('fa-xmark');
                    navIcon.classList.add('fa-bars');
                }
            }
        });

        // إغلاق القائمة عند النقر على أي رابط داخلها في الموبايل
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                if (navIcon) {
                    navIcon.classList.remove('fa-xmark');
                    navIcon.classList.add('fa-bars');
                }
            });
        });
    }

    // 3. تأثير شريط التنقل عند التمرير (Sticky Header Effect & Active Link Spy)
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        // تأثير الظل على الهيدر
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // تحديد القسم الحالي النشط في القائمة
        const scrollY = window.pageYOffset;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            const targetLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

            if (targetLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    targetLink.classList.add('active');
                } else {
                    targetLink.classList.remove('active');
                }
            }
        });
    });

    // 4. تصفية قائمة المنتجات حسب التصنيف (Menu Categories Filter)
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // تحديث الزر النشط
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const selectedCategory = btn.getAttribute('data-category');

            productCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (selectedCategory === 'all' || cardCategory === selectedCategory) {
                    card.style.display = 'flex';
                    // إضافة أنيميشن ظهور ناعم
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        card.style.transition = 'all 0.35s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 20);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 5. زر الطلب المباشر عبر واتساب لكل منتج (Direct WhatsApp Order per Product)
    const orderButtons = document.querySelectorAll('.btn-order-wa');

    orderButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const itemName = button.getAttribute('data-item');
            const itemPrice = button.getAttribute('data-price');

            // تجهيز نص رسالة واتساب أنيقة باللغة العربية
            const message = `مرحباً مخبز قمح وزعتر بالمعادي 🥖
أود طلب الصنف التالي:
- المنتج: ${itemName}
- السعر: ${itemPrice} ج.م

العنوان في المعادي: 
(يرجى كتابة الشارع والمنطقة هنا)`;

            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMessage}`;

            // إظهار إشعار Toast للمستخدم
            showToast(`طلب: ${itemName}`, 'جاري تحويلك إلى واتساب لتأكيد الطلب والتوصيل...');

            // الانتقال إلى واتساب
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
            }, 500);
        });
    });

    // 6. التحقق من حالة المخبز الحالية (مفتوح / مغلق بحسب الساعة)
    function checkBakeryStatus() {
        const statusElement = document.getElementById('bakeryStatus');
        if (!statusElement) return;

        const now = new Date();
        const currentHour = now.getHours();
        const currentDay = now.getDay(); // 5 = الجمعة

        // مواعيد العمل:
        // الأيام العادية: من 7:00 صباحاً حتى 23:00 (11:00 م)
        // يوم الجمعة: من 8:00 صباحاً حتى 23:30 (11:30 م)
        let isOpen = false;
        if (currentDay === 5) {
            isOpen = currentHour >= 8 && currentHour < 23;
        } else {
            isOpen = currentHour >= 7 && currentHour < 23;
        }

        const statusDot = statusElement.querySelector('.status-dot');
        const statusText = statusElement.querySelector('.status-text');

        if (isOpen) {
            if (statusDot) statusDot.style.backgroundColor = '#25d366';
            if (statusText) statusText.textContent = 'مفتوح الآن • نخبز لكم طازجاً في المعادي';
        } else {
            if (statusDot) statusDot.style.backgroundColor = '#eab308';
            if (statusText) statusText.textContent = 'نستقبل طلباتكم الصباحية غداً من 7:00 صباحاً';
        }
    }

    checkBakeryStatus();

    // 7. دالة إظهار الإشعارات السريعة (Toast Notification)
    function showToast(title, desc) {
        const toast = document.getElementById('toast');
        const toastTitle = document.getElementById('toastTitle');
        const toastDesc = document.getElementById('toastDesc');

        if (!toast) return;

        if (toastTitle) toastTitle.textContent = title;
        if (toastDesc) toastDesc.textContent = desc;

        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3500);
    }
});
