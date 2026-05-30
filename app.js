document.addEventListener('DOMContentLoaded', () => {
    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Hamburger Menu
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Toggle hamburger animation
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = navLinks.classList.contains('active') ? 'rotate(45deg) translate(5px, 5px)' : 'none';
            spans[1].style.opacity = navLinks.classList.contains('active') ? '0' : '1';
            spans[2].style.transform = navLinks.classList.contains('active') ? 'rotate(-45deg) translate(6px, -6px)' : 'none';
        });

        // Close menu when link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }

    // Stages Tabs in Details Section
    const tabBtns = document.querySelectorAll('.tab-btn');
    const stagesContents = document.querySelectorAll('.stages-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;

            tabBtns.forEach(b => b.classList.remove('active'));
            stagesContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(target).classList.add('active');
        });
    });

    // Subjects database per educational level
    const subjectsData = {
        'primary': [
            { id: 'math-p', name: 'الرياضيات' },
            { id: 'science-p', name: 'العلوم' },
            { id: 'english-p', name: 'اللغة الإنجليزية' },
            { id: 'arabic-p', name: 'اللغة العربية' },
            { id: 'studies-p', name: 'الدراسات الاجتماعية' }
        ],
        'middle': [
            { id: 'math-m', name: 'الرياضيات' },
            { id: 'science-m', name: 'العلوم العامة' },
            { id: 'english-m', name: 'اللغة الإنجليزية' },
            { id: 'arabic-m', name: 'اللغة العربية' },
            { id: 'studies-m', name: 'الدراسات الاجتماعية' }
        ],
        'high': [
            { id: 'physics-h', name: 'الفيزياء' },
            { id: 'chemistry-h', name: 'الكيمياء' },
            { id: 'biology-h', name: 'الأحياء' },
            { id: 'math-h', name: 'الرياضيات (بحتة وتطبيقية)' },
            { id: 'english-h', name: 'اللغة الإنجليزية' },
            { id: 'comp-h', name: 'علوم الحاسب والبرمجة (DIY Skills)' }
        ]
    };

    // Form selection chips logic
    const stageChips = document.querySelectorAll('.stages-chips .chip');
    const subjectChipsContainer = document.getElementById('subjectChipsContainer');
    let selectedStage = 'middle'; // default stage selection
    let selectedSubjects = new Set();

    // Render subjects based on selected stage
    function renderSubjectChips(stage) {
        subjectChipsContainer.innerHTML = '';
        selectedSubjects.clear();
        
        const subjects = subjectsData[stage] || [];
        subjects.forEach(sub => {
            const chip = document.createElement('div');
            chip.className = 'subject-chip';
            chip.dataset.value = sub.name;
            chip.innerHTML = `<i class="fas fa-plus"></i> ${sub.name}`;
            
            chip.addEventListener('click', () => {
                chip.classList.toggle('selected');
                const icon = chip.querySelector('i');
                
                if (chip.classList.contains('selected')) {
                    selectedSubjects.add(sub.name);
                    icon.className = 'fas fa-check';
                } else {
                    selectedSubjects.delete(sub.name);
                    icon.className = 'fas fa-plus';
                }
            });
            
            subjectChipsContainer.appendChild(chip);
        });
    }

    // Initialize with default
    renderSubjectChips(selectedStage);

    stageChips.forEach(chip => {
        chip.addEventListener('click', () => {
            stageChips.forEach(c => c.classList.remove('selected'));
            chip.classList.add('selected');
            selectedStage = chip.dataset.stage;
            renderSubjectChips(selectedStage);
        });
    });

    // Form submission to WhatsApp
    const bookingForm = document.getElementById('bookingForm');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Validate inputs
            const studentName = document.getElementById('studentName').value.trim();
            const parentPhone = document.getElementById('parentPhone').value.trim();
            const studentPhone = document.getElementById('studentPhone').value.trim() || 'لا يوجد';

            if (!studentName) {
                alert('الرجاء إدخال اسم الطالب');
                return;
            }

            if (selectedSubjects.size === 0) {
                alert('الرجاء اختيار مادة واحدة على الأقل من المواد المطلوبة');
                return;
            }

            if (!parentPhone) {
                alert('الرجاء إدخال رقم ولي الأمر للتواصل');
                return;
            }

            // Map stage value to a readable Arabic name
            let stageName = '';
            if (selectedStage === 'primary') stageName = 'المرحلة الابتدائية';
            else if (selectedStage === 'middle') stageName = 'المرحلة الإعدادية';
            else if (selectedStage === 'high') stageName = 'المرحلة الثانوية';

            const subjectsList = Array.from(selectedSubjects).join('، ');

            // Constructing the elegant Arabic message
            const message = 
`*طلب حجز جديد بمنصة DIY Academy* 🎓
-----------------------------------------
👤 *اسم الطالب:* ${studentName}
🏫 *المرحلة الدراسية:* ${stageName}
📚 *المواد المطلوبة:* ${subjectsList}
📞 *رقم ولي الأمر:* ${parentPhone}
📱 *رقم الطالب:* ${studentPhone}
-----------------------------------------
تاريخ الإرسال: ${new Date().toLocaleDateString('ar-EG')}
يرجى التواصل لتأكيد المواعيد والبدء المباشر.`;

            // URL Encode the message
            const encodedMessage = encodeURIComponent(message);
            
            // Egyptian WhatsApp number: +201020034332
            const whatsappNumber = '201020034332';
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

            window.open(whatsappUrl, '_blank');
            openSuccessModal(whatsappUrl);
        });
    }
    // =========================================
    // Scroll Reveal — Intersection Observer
    // =========================================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // =========================================
    // Success Modal
    // =========================================
    const successModal = document.getElementById('successModal');
    const modalCountdownEl = document.getElementById('modalCountdown');
    let countdownTimer = null;

    window.openSuccessModal = function(url) {
        successModal.classList.add('active');
        let count = 4;
        updateCountdown(count);
        countdownTimer = setInterval(() => {
            count--;
            if (count > 0) {
                updateCountdown(count);
            } else {
                clearInterval(countdownTimer);
                modalCountdownEl.textContent = 'جاري فتح واتساب...';
                window.open(url, '_blank');
            }
        }, 1000);
    };

    function updateCountdown(n) {
        modalCountdownEl.textContent = `سيفتح واتساب خلال ${n} ثوانٍ...`;
    }

    window.closeModal = function() {
        successModal.classList.remove('active');
        clearInterval(countdownTimer);
    };

    if (successModal) {
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) window.closeModal();
        });
    }
});
