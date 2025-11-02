// Internationalization (i18n) system for ParkLine Residences
class I18nManager {
    constructor() {
        this.currentLanguage = 'mk'; // Default to Macedonian
        this.translations = {
            mk: {
                // Header and Navigation
                'view-1': 'Поглед 1',
                'view-2': 'Поглед 2',
                
                // Filters
                'filter-floor': 'СПРАТ:',
                'filter-bedrooms': 'СПАЛНИ СОБИ:',
                'filter-area': 'ВКУПНО (М²):',
                'clear-filters': 'Отстрани маски',
                'restore-filters': 'Врати маски',
                
                // Status
                'status-available': 'СЛОБОДЕН',
                'status-reserved': 'РЕЗЕРВИРАН',
                'status-sold': 'ПРОДАДЕН',
                
                // Apartment Details
                'apartment-details': 'Детали за станот',
                'apartment-no': 'Стан бр.',
                'office-space': 'Деловен простор',
                'bedrooms': 'Спални соби',
                'floor': 'Спрат',
                'area': 'Површина',
                'status': 'Статус',
                'room': 'соба',
                'rooms': 'соби',
                'floor-suffix': '. спрат',
                'link': 'Link',
                'na': 'Н/А',
                
                // Loading and Error Messages
                'app-title': 'ParkLine Residences',
                'loading-data': 'Се вчитуваат податоците за становите...',
                'initializing': 'Се иницијализира...',
                'step': 'Чекор',
                'application-error': 'Грешка во апликацијата',
                'error-message': 'Се случи проблем при вчитувањето на визуелизацијата на становите. Ова може да се должи на проблеми со мрежната врска или вчитувањето на податоците.',
                'reload-application': '🔄 Рестартирај апликација',
                'technical-details': 'Технички детали',
                'error': 'Грешка:',
                'retry-attempts': 'Обиди за повторување:',
                'load-time': 'Време на вчитување:',
                
                // Analytics
                'total-apartments': 'Вкупно станови',
                'units': 'единици',
                'available': 'Слободни',
                'reserved': 'Резервирани',
                'sold': 'Продадени',
                'percent-of-total': '% од вкупно',
                'bedroom-distribution': 'Распределба по спални соби',
                'bedrooms-label': 'Спални соби:',
                'data-status': 'Статус на податоците',
                'source': 'Извор:',
                'last-update': 'Последно ажурирање:',
                'apartments-loaded': 'Вчитани станови:',
                'current-view': 'Тековен поглед:',
                
                // Mobile Filter Toggle
                'show-filters': 'ФИЛТРИ',
                'hide-filters': 'СОКРИЈ ФИЛТРИ',
                
                // Contact Button
                'interested-button': 'Пополни формулар',
                'email-subject': 'Се интересирам за стан %ID% - ParkLine Residences',
                'express-interest-button': 'Испрати емаил',
                'email-notification': 'Вашиот емаил клиент ќе се отвори...',

                // Lead Form
                'lead-form-title': 'Испрати барање за интерес',
                'lead-form-apartment-details': 'Детали за станот',
                'lead-form-your-info': 'Ваши информации',
                'lead-form-name-label': 'Име и презиме',
                'lead-form-email-label': 'Емаил адреса',
                'lead-form-phone-label': 'Телефонски број',
                'lead-form-phone-placeholder': '+389...',
                'lead-form-contact-method-label': 'Преферирам контакт преку',
                'lead-form-contact-phone': 'Телефон',
                'lead-form-contact-email': 'Емаил',
                'lead-form-message-label': 'Дополнителна порака (опционално)',
                'lead-form-message-placeholder': 'Напишете ја вашата порака овде...',
                'lead-form-required': '*',
                'lead-form-submit': 'Испрати барање',
                'lead-form-submitting': 'Се испраќа...',
                'lead-form-cancel': 'Откажи',
                'lead-form-apartment-label': 'Стан:',

                // Lead Form Error Messages
                'lead-form-error-name': 'Ве молиме внесете го вашето име',
                'lead-form-error-email': 'Ве молиме внесете валидна емаил адреса',
                'lead-form-error-phone': 'Ве молиме внесете валиден телефонски број',

                // Lead Form Success/Error Messages
                'lead-form-success': 'Вашето барање е успешно испратено! Наш тим ќе ве контактира наскоро.',
                'lead-form-error-general': 'Се случи грешка. Ве молиме обидете се повторно или контактирајте не директно.',
                'lead-form-error-config': 'Системот не е правилно конфигуриран. Ве молиме контактирајте не директно.',
                'lead-form-error-timeout': 'Барањето истече. Ве молиме проверете ја вашата интернет врска и обидете се повторно.',
                'lead-form-error-required-fields': 'Ве молиме пополнете ги сите задолжителни полиња (име, емаил, телефон).',

                // Success Modal
                'success-modal-title': 'Успешно испратено!',
                'success-modal-message': 'Вашето барање е испратено успешно. Наш тим ќе ве контактира наскоро за да ви даде повеќе информации.',
                'success-modal-button': 'Во ред'
            },
            en: {
                // Header and Navigation
                'view-1': 'View 1',
                'view-2': 'View 2',
                
                // Filters
                'filter-floor': 'FLOOR:',
                'filter-bedrooms': 'BEDROOMS:',
                'filter-area': 'TOTAL (M²):',
                'clear-filters': 'Clear Filters',
                'restore-filters': 'Restore Filters',
                
                // Status
                'status-available': 'AVAILABLE',
                'status-reserved': 'RESERVED',
                'status-sold': 'SOLD',
                
                // Apartment Details
                'apartment-details': 'Apartment Details',
                'apartment-no': 'Apartment No.',
                'office-space': 'Office Space',
                'bedrooms': 'Bedrooms',
                'floor': 'Floor',
                'area': 'Area',
                'status': 'Status',
                'room': 'room',
                'rooms': 'rooms',
                'floor-suffix': '. floor',
                'link': 'Link',
                'na': 'N/A',
                
                // Loading and Error Messages
                'app-title': 'ParkLine Residences',
                'loading-data': 'Loading apartment data...',
                'initializing': 'Initializing...',
                'step': 'Step',
                'application-error': 'Application Error',
                'error-message': 'We encountered an issue loading the apartment visualization. This might be due to network connectivity or data loading problems.',
                'reload-application': '🔄 Reload Application',
                'technical-details': 'Technical Details',
                'error': 'Error:',
                'retry-attempts': 'Retry attempts:',
                'load-time': 'Load time:',
                
                // Analytics
                'total-apartments': 'Total Apartments',
                'units': 'units',
                'available': 'Available',
                'reserved': 'Reserved',
                'sold': 'Sold',
                'percent-of-total': '% of total',
                'bedroom-distribution': 'Bedroom Distribution',
                'bedrooms-label': 'Bedrooms:',
                'data-status': 'Data Status',
                'source': 'Source:',
                'last-update': 'Last Update:',
                'apartments-loaded': 'Apartments Loaded:',
                'current-view': 'Current View:',
                
                // Mobile Filter Toggle
                'show-filters': 'FILTERS',
                'hide-filters': 'HIDE FILTERS',
                
                // Contact Button
                'interested-button': 'Fill Form',
                'email-subject': 'I am interested in Apartment %ID% - ParkLine Residences',
                'express-interest-button': 'Send Email',
                'email-notification': 'Your email client will open...',

                // Lead Form
                'lead-form-title': 'Submit Interest Request',
                'lead-form-apartment-details': 'Apartment Details',
                'lead-form-your-info': 'Your Information',
                'lead-form-name-label': 'Full Name',
                'lead-form-email-label': 'Email Address',
                'lead-form-phone-label': 'Phone Number',
                'lead-form-phone-placeholder': '+389...',
                'lead-form-contact-method-label': 'Preferred contact method',
                'lead-form-contact-phone': 'Phone',
                'lead-form-contact-email': 'Email',
                'lead-form-message-label': 'Additional message (optional)',
                'lead-form-message-placeholder': 'Write your message here...',
                'lead-form-required': '*',
                'lead-form-submit': 'Submit Request',
                'lead-form-submitting': 'Submitting...',
                'lead-form-cancel': 'Cancel',
                'lead-form-apartment-label': 'Apartment:',

                // Lead Form Error Messages
                'lead-form-error-name': 'Please enter your name',
                'lead-form-error-email': 'Please enter a valid email address',
                'lead-form-error-phone': 'Please enter a valid phone number',

                // Lead Form Success/Error Messages
                'lead-form-success': 'Your request has been submitted successfully! Our team will contact you soon.',
                'lead-form-error-general': 'An error occurred. Please try again or contact us directly.',
                'lead-form-error-config': 'System is not properly configured. Please contact us directly.',
                'lead-form-error-timeout': 'Request timed out. Please check your internet connection and try again.',
                'lead-form-error-required-fields': 'Please fill in all required fields (name, email, phone).',

                // Success Modal
                'success-modal-title': 'Successfully Submitted!',
                'success-modal-message': 'Your request has been sent successfully. Our team will contact you soon to provide more information.',
                'success-modal-button': 'OK'
            },
            sq: {
                // Header and Navigation
                'view-1': 'Pamje 1',
                'view-2': 'Pamje 2',
                
                // Filters
                'filter-floor': 'KATI:',
                'filter-bedrooms': 'DHOMA GJUMI:',
                'filter-area': 'TOTAL (M²):',
                'clear-filters': 'Fshij Filtrat',
                'restore-filters': 'Rivendos Filtrat',
                
                // Status
                'status-available': 'I LIRË',
                'status-reserved': 'I REZERVUAR',
                'status-sold': 'I SHITUR',
                
                // Apartment Details
                'apartment-details': 'Detajet e Apartamentit',
                'apartment-no': 'Apartamenti Nr.',
                'office-space': 'Zyrë',
                'bedrooms': 'Dhoma Gjumi',
                'floor': 'Kati',
                'area': 'Sipërfaqja',
                'status': 'Statusi',
                'room': 'dhomë',
                'rooms': 'dhoma',
                'floor-suffix': '. kat',
                'link': 'Lidhje',
                'na': 'N/A',
                
                // Loading and Error Messages
                'app-title': 'ParkLine Residences',
                'loading-data': 'Duke ngarkuar të dhënat e apartamentit...',
                'initializing': 'Duke inicializuar...',
                'step': 'Hapi',
                'application-error': 'Gabim në Aplikacion',
                'error-message': 'Kemi hasur një problem gjatë ngarkimit të vizualizimit të apartamentit. Kjo mund të jetë për shkak të lidhjes së rrjetit ose problemeve me ngarkimin e të dhënave.',
                'reload-application': '🔄 Rindizni Aplikacionin',
                'technical-details': 'Detajet Teknike',
                'error': 'Gabim:',
                'retry-attempts': 'Tentativa të ripërsëritjes:',
                'load-time': 'Koha e ngarkimit:',
                
                // Analytics
                'total-apartments': 'Gjithsej Apartamente',
                'units': 'njësi',
                'available': 'Të Lira',
                'reserved': 'Të Rezervuara',
                'sold': 'Të Shitura',
                'percent-of-total': '% e totalit',
                'bedroom-distribution': 'Shpërndarja e Dhomave të Gjumit',
                'bedrooms-label': 'Dhoma Gjumi:',
                'data-status': 'Statusi i të Dhënave',
                'source': 'Burimi:',
                'last-update': 'Përditësimi i Fundit:',
                'apartments-loaded': 'Apartamente të Ngarkuara:',
                'current-view': 'Pamja Aktuale:',
                
                // Mobile Filter Toggle
                'show-filters': 'FILTRAT',
                'hide-filters': 'FSHIH FILTRAT',
                
                // Contact Button
                'interested-button': 'Plotëso Formularin',
                'email-subject': 'Jam i interesuar për Apartamentin %ID% - ParkLine Residences',
                'express-interest-button': 'Dergo Email',
                'email-notification': 'Klienti juaj i emailit do të hapet...',

                // Lead Form
                'lead-form-title': 'Dërgo Kërkesë për Interes',
                'lead-form-apartment-details': 'Detajet e Apartamentit',
                'lead-form-your-info': 'Informacionet Tuaja',
                'lead-form-name-label': 'Emri dhe Mbiemri',
                'lead-form-email-label': 'Adresa e Emailit',
                'lead-form-phone-label': 'Numri i Telefonit',
                'lead-form-phone-placeholder': '+389...',
                'lead-form-contact-method-label': 'Metoda e preferuar e kontaktit',
                'lead-form-contact-phone': 'Telefon',
                'lead-form-contact-email': 'Email',
                'lead-form-message-label': 'Mesazh shtesë (opsionale)',
                'lead-form-message-placeholder': 'Shkruani mesazhin tuaj këtu...',
                'lead-form-required': '*',
                'lead-form-submit': 'Dërgo Kërkesën',
                'lead-form-submitting': 'Duke dërguar...',
                'lead-form-cancel': 'Anulo',
                'lead-form-apartment-label': 'Apartamenti:',

                // Lead Form Error Messages
                'lead-form-error-name': 'Ju lutemi vendosni emrin tuaj',
                'lead-form-error-email': 'Ju lutemi vendosni një adresë emaili të vlefshme',
                'lead-form-error-phone': 'Ju lutemi vendosni një numër telefoni të vlefshëm',

                // Lead Form Success/Error Messages
                'lead-form-success': 'Kërkesa juaj u dërgua me sukses! Ekipi ynë do t\'ju kontaktojë së shpejti.',
                'lead-form-error-general': 'Ndodhi një gabim. Ju lutemi provoni përsëri ose na kontaktoni drejtpërdrejt.',
                'lead-form-error-config': 'Sistemi nuk është konfiguruar siç duhet. Ju lutemi na kontaktoni drejtpërdrejt.',
                'lead-form-error-timeout': 'Kërkesa skadoi. Ju lutemi kontrolloni lidhjen tuaj të internetit dhe provoni përsëri.',
                'lead-form-error-required-fields': 'Ju lutemi plotësoni të gjitha fushat e detyrueshme (emri, emaili, telefoni).',

                // Success Modal
                'success-modal-title': 'U Dërgua me Sukses!',
                'success-modal-message': 'Kërkesa juaj është dërguar me sukses. Ekipi ynë do t\'ju kontaktojë së shpejti për të dhënë më shumë informacion.',
                'success-modal-button': 'Në rregull'
            }
        };
        
        // Load saved language from localStorage
        const savedLanguage = localStorage.getItem('parkline-language');
        if (savedLanguage && this.translations[savedLanguage]) {
            this.currentLanguage = savedLanguage;
        }
    }

    // Get translation for a key
    t(key) {
        return this.translations[this.currentLanguage][key] || key;
    }

    // Get status display text
    getStatusDisplay(status) {
        const statusKey = `status-${status}`;
        return this.t(statusKey);
    }

    // Get bedroom text (singular/plural)
    getBedroomText(count) {
        return count === 1 ? this.t('room') : this.t('rooms');
    }

    // Get floor text with suffix
    getFloorText(floor) {
        if (this.currentLanguage === 'mk') {
            return `${floor}${this.t('floor-suffix')}`;
        } else if (this.currentLanguage === 'en') {
            const suffix = floor === 1 ? 'st' : floor === 2 ? 'nd' : floor === 3 ? 'rd' : 'th';
            return `${floor}${suffix} floor`;
        } else { // Albanian
            return `${floor}${this.t('floor-suffix')}`;
        }
    }

    // Get email subject with apartment ID
    getEmailSubject(apartmentId) {
        const template = this.t('email-subject');
        return template.replace('%ID%', apartmentId);
    }

    // Switch language
    switchLanguage(language) {
        if (!this.translations[language]) {
            console.warn(`Language ${language} not supported`);
            return;
        }

        this.currentLanguage = language;
        localStorage.setItem('parkline-language', language);
        
        // Update all translatable elements
        this.updateAllTranslations();
        
        // Update language switcher buttons
        this.updateLanguageSwitcher();
        
        // Trigger custom event for other components
        document.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: language }
        }));
        
        console.log(`🌐 Language switched to: ${language}`);
    }

    // Update all elements with data-i18n attributes
    updateAllTranslations() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (element.tagName === 'INPUT' && element.type === 'button') {
                element.value = translation;
            } else if (element.tagName === 'BUTTON') {
                element.textContent = translation;
            } else {
                element.textContent = translation;
            }
        });
        
        // NEW: Trigger apartment details refresh if visible
        if (apartmentDetailsManager && apartmentDetailsManager.isVisible && apartmentDetailsManager.currentApartment) {
            apartmentDetailsManager.showDetails(apartmentDetailsManager.currentApartment);
        }
    }

    // Update language switcher button visibility
    updateLanguageSwitcher() {
        const buttons = document.querySelectorAll('.language-btn');
        buttons.forEach(btn => {
            const lang = btn.getAttribute('data-lang');
            if (lang === this.currentLanguage) {
                btn.style.display = 'none';
            } else {
                btn.style.display = 'inline-block';
            }
        });
    }

    // Initialize the i18n system
    initialize() {
        console.log('🌐 Initializing i18n system...');
        
        // Create language switcher
        this.createLanguageSwitcher();
        
        // Update all translations
        this.updateAllTranslations();
        
        // Update language switcher visibility
        this.updateLanguageSwitcher();
        
        console.log(`✅ i18n initialized with language: ${this.currentLanguage}`);
    }

    // Create language switcher buttons
    createLanguageSwitcher() {
        const buildingContainer = document.querySelector('.building-container');
        if (!buildingContainer) return;

        // Check if language switcher already exists
        if (document.querySelector('.language-switcher')) return;

        const languageSwitcher = document.createElement('div');
        languageSwitcher.className = 'language-switcher language-switcher-image-top-right';
        
        const languages = [
            { code: 'mk', label: 'MK' },
            { code: 'en', label: 'EN' },
            { code: 'sq', label: 'SHQ' }
        ];

        languages.forEach(lang => {
            const button = document.createElement('button');
            button.className = 'language-btn';
            button.setAttribute('data-lang', lang.code);
            button.textContent = lang.label;
            button.onclick = () => this.switchLanguage(lang.code);
            languageSwitcher.appendChild(button);
        });

        buildingContainer.appendChild(languageSwitcher);
    }

    // Get current language
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    // Get available languages
    getAvailableLanguages() {
        return Object.keys(this.translations);
    }
}

// Create global instance
const i18nManager = new I18nManager();

// Global function for easy access
function t(key) {
    return i18nManager.t(key);
}