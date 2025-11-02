class LeadFormManager {
    constructor() {
        this.isVisible = false;
        this.currentApartment = null;
        this.isSubmitting = false;
        this.init();
    }

    init() {
        this.createFormHTML();
        this.attachEventListeners();
        console.log('✅ Lead form manager initialized');
    }

    createFormHTML() {
        const formHTML = `
            <div class="lead-form-overlay" id="leadFormOverlay">
                <div class="lead-form-container">
                    <div class="lead-form-header">
                        <h2 id="leadFormTitle" data-i18n="lead-form-title"></h2>
                        <button class="lead-form-close" id="leadFormClose">&times;</button>
                    </div>
                    <div class="lead-form-body">
                        <div class="success-message" id="leadSuccessMessage"></div>
                        <div class="error-message" id="leadErrorMessage"></div>

                        <div class="apartment-summary" id="apartmentSummary">
                            <h3 data-i18n="lead-form-apartment-details"></h3>
                            <div class="apartment-info" id="apartmentInfo">
                            </div>
                        </div>

                        <form id="leadForm">
                            <div class="form-section">
                                <h3 data-i18n="lead-form-your-info"></h3>

                                <div class="form-group">
                                    <label><span data-i18n="lead-form-name-label"></span> <span class="required" data-i18n="lead-form-required"></span></label>
                                    <input type="text" class="form-input" id="contactName" required>
                                    <div class="form-error" id="errorName" data-i18n="lead-form-error-name"></div>
                                </div>

                                <div class="form-group">
                                    <label><span data-i18n="lead-form-email-label"></span> <span class="required" data-i18n="lead-form-required"></span></label>
                                    <input type="email" class="form-input" id="contactEmail" required>
                                    <div class="form-error" id="errorEmail" data-i18n="lead-form-error-email"></div>
                                </div>

                                <div class="form-group">
                                    <label><span data-i18n="lead-form-phone-label"></span> <span class="required" data-i18n="lead-form-required"></span></label>
                                    <input type="tel" class="form-input" id="contactPhone" required data-placeholder-i18n="lead-form-phone-placeholder">
                                    <div class="form-error" id="errorPhone" data-i18n="lead-form-error-phone"></div>
                                </div>

                                <div class="form-group">
                                    <label data-i18n="lead-form-contact-method-label"></label>
                                    <div class="contact-methods">
                                        <label class="contact-method-option selected">
                                            <input type="radio" name="contactMethod" value="phone" checked>
                                            <span>📞 <span data-i18n="lead-form-contact-phone"></span></span>
                                        </label>
                                        <label class="contact-method-option">
                                            <input type="radio" name="contactMethod" value="email">
                                            <span>✉️ <span data-i18n="lead-form-contact-email"></span></span>
                                        </label>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label data-i18n="lead-form-message-label"></label>
                                    <textarea class="form-textarea" id="contactMessage" data-placeholder-i18n="lead-form-message-placeholder"></textarea>
                                </div>
                            </div>

                            <div class="form-footer">
                                <button type="button" class="btn-cancel" id="btnCancel" data-i18n="lead-form-cancel"></button>
                                <button type="submit" class="btn-submit" id="btnSubmit">
                                    <span id="submitText" data-i18n="lead-form-submit"></span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', formHTML);

        // Apply translations immediately after creating HTML
        this.updateFormTranslations();
    }

    attachEventListeners() {
        const overlay = document.getElementById('leadFormOverlay');
        const closeBtn = document.getElementById('leadFormClose');
        const cancelBtn = document.getElementById('btnCancel');
        const form = document.getElementById('leadForm');

        overlay?.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.hide();
            }
        });

        closeBtn?.addEventListener('click', () => this.hide());
        cancelBtn?.addEventListener('click', () => this.hide());
        form?.addEventListener('submit', (e) => this.handleSubmit(e));

        const contactMethodOptions = document.querySelectorAll('.contact-method-option');
        contactMethodOptions.forEach(option => {
            option.addEventListener('click', () => {
                contactMethodOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                option.querySelector('input').checked = true;
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hide();
            }
        });

        // Listen for language changes
        document.addEventListener('languageChanged', () => {
            this.updateFormTranslations();
        });
    }

    show(apartment) {
        if (!apartment) {
            console.error('No apartment data provided');
            return;
        }

        this.currentApartment = apartment;

        // Update translations first, then populate apartment info to avoid recursion
        this.updateFormTranslations();
        this.populateApartmentInfo(apartment);
        this.resetForm();

        const overlay = document.getElementById('leadFormOverlay');
        if (overlay) {
            overlay.classList.add('active');
            this.isVisible = true;
            document.body.style.overflow = 'hidden';
        }
    }

    hide() {
        const overlay = document.getElementById('leadFormOverlay');
        if (overlay) {
            overlay.classList.remove('active');
            this.isVisible = false;
            document.body.style.overflow = '';

            setTimeout(() => {
                this.resetForm();
                this.hideMessages();
            }, 300);
        }
    }

    updateFormTranslations() {
        // Update all elements with data-i18n attributes
        const elements = document.querySelectorAll('#leadFormOverlay [data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = i18nManager.t(key);

            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                // Don't change input values, only their attributes
            } else {
                element.textContent = translation;
            }
        });

        // Update placeholders
        const phonePlaceholder = document.querySelector('[data-placeholder-i18n="lead-form-phone-placeholder"]');
        if (phonePlaceholder) {
            phonePlaceholder.placeholder = i18nManager.t('lead-form-phone-placeholder');
        }

        const messagePlaceholder = document.querySelector('[data-placeholder-i18n="lead-form-message-placeholder"]');
        if (messagePlaceholder) {
            messagePlaceholder.placeholder = i18nManager.t('lead-form-message-placeholder');
        }

        // Update submit button if not loading
        if (!this.isSubmitting) {
            const submitText = document.getElementById('submitText');
            if (submitText) {
                submitText.textContent = i18nManager.t('lead-form-submit');
            }
        }

        // REMOVED: populateApartmentInfo() call here to break infinite recursion loop
        // Apartment info is populated separately in show() method
        // When language changes, the next time form is opened it will have correct translations
    }

    populateApartmentInfo(apartment) {
        const infoContainer = document.getElementById('apartmentInfo');
        if (!infoContainer) return;

        const apartmentData = apartment.data || {};

        let infoHTML = '';

        if (apartment.id) {
            infoHTML += `<div class="apartment-info-item"><strong>${i18nManager.t('lead-form-apartment-label')}</strong> ${apartment.id}</div>`;
        }

        Object.entries(apartmentData).forEach(([key, fieldData]) => {
            if (!key || !fieldData) return;

            const keyLower = key.toLowerCase();
            if (keyLower.includes('статус') || keyLower.includes('status')) return;

            let displayValue = '';
            let displayKey = key;

            if (typeof fieldData === 'object' && fieldData.value !== undefined) {
                displayValue = fieldData.value;

                if (fieldData.subjects && typeof fieldData.subjects === 'object') {
                    const currentLang = i18nManager.getCurrentLanguage();
                    // Try current language first, then fallback to mk, then sq, then en, then original key
                    displayKey = fieldData.subjects[currentLang] ||
                               fieldData.subjects.mk ||
                               fieldData.subjects.sq ||
                               fieldData.subjects.en ||
                               key;
                }
            } else {
                displayValue = fieldData;
            }

            if (displayValue && displayValue.toString().trim() !== '') {
                infoHTML += `<div class="apartment-info-item"><strong>${displayKey}:</strong> ${displayValue}</div>`;
            }
        });

        infoContainer.innerHTML = infoHTML;

        // REMOVED: updateFormTranslations() call here to break infinite recursion loop
        // Translations are updated in show() method and on language change event
    }

    resetForm() {
        const form = document.getElementById('leadForm');
        if (form) {
            form.reset();

            const inputs = form.querySelectorAll('.form-input, .form-textarea');
            inputs.forEach(input => input.classList.remove('error'));

            const errors = form.querySelectorAll('.form-error');
            errors.forEach(error => error.classList.remove('visible'));

            const firstOption = document.querySelector('.contact-method-option');
            if (firstOption) {
                document.querySelectorAll('.contact-method-option').forEach(opt => opt.classList.remove('selected'));
                firstOption.classList.add('selected');
            }
        }

        this.hideMessages();
    }

    validateForm() {
        let isValid = true;

        const name = document.getElementById('contactName');
        const email = document.getElementById('contactEmail');
        const phone = document.getElementById('contactPhone');

        if (!name.value.trim()) {
            this.showFieldError('contactName', 'errorName');
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
            this.showFieldError('contactEmail', 'errorEmail');
            isValid = false;
        }

        // Phone is required - validate it has value and basic format
        const phoneValue = phone.value.trim();
        if (!phoneValue) {
            this.showFieldError('contactPhone', 'errorPhone');
            isValid = false;
        } else {
            // Basic phone validation - at least 6 digits
            const phoneDigits = phoneValue.replace(/\D/g, '');
            if (phoneDigits.length < 6) {
                this.showFieldError('contactPhone', 'errorPhone');
                isValid = false;
            }
        }

        return isValid;
    }

    showFieldError(fieldId, errorId) {
        const field = document.getElementById(fieldId);
        const error = document.getElementById(errorId);
        if (field) field.classList.add('error');
        if (error) error.classList.add('visible');
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (this.isSubmitting) return;

        const form = document.getElementById('leadForm');
        const inputs = form.querySelectorAll('.form-input, .form-textarea');
        inputs.forEach(input => input.classList.remove('error'));

        const errors = form.querySelectorAll('.form-error');
        errors.forEach(error => error.classList.remove('visible'));

        if (!this.validateForm()) {
            return;
        }

        this.isSubmitting = true;
        this.setSubmitButtonLoading(true);
        this.hideMessages();

        const apartmentData = this.currentApartment?.data || {};

        const leadData = {
            apartment_id: this.currentApartment?.id,
            apartment_floor: this.extractFloorNumber(apartmentData) || this.currentApartment?.floor,
            apartment_size: this.extractNumericValue('површина', apartmentData) || this.currentApartment?.area,
            apartment_price: this.extractNumericValue('цена', apartmentData) || this.extractNumericValue('price', apartmentData),
            apartment_bedrooms: this.extractNumericValue('спални', apartmentData) || this.currentApartment?.bedrooms,
            contact_name: document.getElementById('contactName').value.trim(),
            contact_email: document.getElementById('contactEmail').value.trim(),
            contact_phone: document.getElementById('contactPhone').value.trim(),
            preferred_contact_method: document.querySelector('input[name="contactMethod"]:checked')?.value || 'phone',
            message: document.getElementById('contactMessage').value.trim(),
            source: `${window.location.pathname} - ${this.currentApartment?.view || 'View 1'}`
        };

        try {
            if (!window.supabaseCRM?.isInitialized) {
                console.warn('⚠️ Supabase CRM not initialized, attempting re-initialization...');
                if (window.supabaseCRM?.ensureInitialized) {
                    window.supabaseCRM.ensureInitialized();
                }
            }

            if (!window.supabaseCRM?.isInitialized) {
                throw new Error('Supabase CRM not initialized. Please check your configuration.');
            }

            let bitrixLeadId = null;
            let bitrixError = null;

            if (window.bitrixIntegration?.isConfigured) {
                try {
                    console.log('🔄 Creating lead in Bitrix...');
                    const bitrixResult = await window.bitrixIntegration.createLead(leadData);
                    bitrixLeadId = bitrixResult.bitrixLeadId;
                    console.log('✅ Lead created in Bitrix:', bitrixLeadId);
                } catch (error) {
                    console.warn('⚠️ Bitrix integration failed, continuing with Supabase:', error);
                    console.warn('⚠️ Bitrix error details:', error.message, error.stack);
                    bitrixError = error.message;
                }
            } else {
                console.log('ℹ️ Bitrix integration not configured, skipping...');
            }

            leadData.bitrix_lead_id = bitrixLeadId;

            console.log('🔄 Saving lead to Supabase...');
            const supabasePromise = window.supabaseCRM.createLead(leadData);
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Supabase request timeout')), 10000)
            );

            const supabaseLead = await Promise.race([supabasePromise, timeoutPromise]);
            console.log('✅ Lead saved to Supabase:', supabaseLead?.id);

            await window.supabaseCRM.logSync({
                sync_type: 'lead_create',
                entity_type: 'lead',
                entity_id: supabaseLead.id,
                bitrix_id: bitrixLeadId,
                status: bitrixLeadId ? 'success' : 'failed',
                request_payload: leadData,
                error_message: bitrixError
            }).catch(err => console.warn('⚠️ Failed to log sync:', err));

            console.log('✅ Form submission complete!');
            this.showSuccessMessage(`✅ ${i18nManager.t('lead-form-success')}`);

            setTimeout(() => {
                this.hide();
            }, 3000);

        } catch (error) {
            console.error('❌ Error submitting lead:', error);
            console.error('❌ Error details:', error.message);
            console.error('❌ Error code:', error.code);

            let errorMessage = `❌ ${i18nManager.t('lead-form-error-general')}`;

            if (error.message.includes('not initialized')) {
                errorMessage = `❌ ${i18nManager.t('lead-form-error-config')}`;
            } else if (error.message.includes('timeout')) {
                errorMessage = `❌ ${i18nManager.t('lead-form-error-timeout')}`;
            } else if (error.code === '42501' || error.message.includes('row-level security')) {
                errorMessage = '❌ Database configuration error. Please contact support.';
            } else if (error.message.includes('violates not-null') || error.message.includes('null value') || error.code === '23502' || error.code === 'PGRST116') {
                errorMessage = `❌ ${i18nManager.t('lead-form-error-required-fields')}`;
            }

            this.showErrorMessage(errorMessage);
        } finally {
            this.isSubmitting = false;
            this.setSubmitButtonLoading(false);
        }
    }

    extractFloorNumber(data) {
        let floorStr = '';

        Object.entries(data).forEach(([key, fieldData]) => {
            if (floorStr) return;

            const keyword = typeof fieldData === 'object' && fieldData.filterKeyword
                ? fieldData.filterKeyword.toLowerCase()
                : '';
            const keyLower = key.toLowerCase();

            if (keyword.includes('floor') || keyLower.includes('спрат') || keyLower.includes('кат')) {
                floorStr = typeof fieldData === 'object' && fieldData.value !== undefined
                    ? fieldData.value.toString()
                    : fieldData.toString();
            }
        });

        if (!floorStr) return null;

        const match = floorStr.match(/\d+/);
        return match ? parseInt(match[0]) : null;
    }

    extractNumericValue(fieldKey, data, suffix = '') {
        if (!data) return null;

        let valueStr = '';

        Object.entries(data).forEach(([key, fieldData]) => {
            if (valueStr) return;

            const keyLower = key.toLowerCase();
            const fieldKeyLower = fieldKey.toLowerCase();

            if (keyLower.includes(fieldKeyLower)) {
                valueStr = typeof fieldData === 'object' && fieldData.value !== undefined
                    ? fieldData.value.toString()
                    : fieldData.toString();
            }
        });

        if (!valueStr) return null;

        const numStr = valueStr.replace(suffix, '').replace(/[^\d.,]/g, '').replace(/,/g, '.').trim();
        const num = parseFloat(numStr);
        return isNaN(num) ? null : num;
    }

    setSubmitButtonLoading(loading) {
        const submitBtn = document.getElementById('btnSubmit');
        const submitText = document.getElementById('submitText');

        if (submitBtn) {
            submitBtn.disabled = loading;
            if (loading) {
                submitText.innerHTML = `<span class="loading-spinner"></span>${i18nManager.t('lead-form-submitting')}`;
            } else {
                submitText.textContent = i18nManager.t('lead-form-submit');
            }
        }
    }

    showSuccessMessage(message) {
        const successMsg = document.getElementById('leadSuccessMessage');
        if (successMsg) {
            successMsg.textContent = message;
            successMsg.classList.add('visible');
        }
    }

    showErrorMessage(message) {
        const errorMsg = document.getElementById('leadErrorMessage');
        if (errorMsg) {
            errorMsg.textContent = message;
            errorMsg.classList.add('visible');
        }
    }

    hideMessages() {
        const successMsg = document.getElementById('leadSuccessMessage');
        const errorMsg = document.getElementById('leadErrorMessage');
        if (successMsg) successMsg.classList.remove('visible');
        if (errorMsg) errorMsg.classList.remove('visible');
    }
}

window.leadFormManager = new LeadFormManager();

function showLeadForm(apartment) {
    if (window.leadFormManager) {
        window.leadFormManager.show(apartment);
    }
}
