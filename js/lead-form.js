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
                        <h2 id="leadFormTitle">Изрази интерес</h2>
                        <button class="lead-form-close" id="leadFormClose">&times;</button>
                    </div>
                    <div class="lead-form-body">
                        <div class="success-message" id="leadSuccessMessage"></div>
                        <div class="error-message" id="leadErrorMessage"></div>

                        <div class="apartment-summary" id="apartmentSummary">
                            <h3>Детали за станот</h3>
                            <div class="apartment-info" id="apartmentInfo">
                            </div>
                        </div>

                        <form id="leadForm">
                            <div class="form-section">
                                <h3>Ваши информации</h3>

                                <div class="form-group">
                                    <label>Име и презиме <span class="required">*</span></label>
                                    <input type="text" class="form-input" id="contactName" required>
                                    <div class="form-error" id="errorName">Ве молиме внесете го вашето име</div>
                                </div>

                                <div class="form-group">
                                    <label>Емаил адреса <span class="required">*</span></label>
                                    <input type="email" class="form-input" id="contactEmail" required>
                                    <div class="form-error" id="errorEmail">Ве молиме внесете валидна емаил адреса</div>
                                </div>

                                <div class="form-group">
                                    <label>Телефонски број <span class="required">*</span></label>
                                    <input type="tel" class="form-input" id="contactPhone" required>
                                    <div class="form-error" id="errorPhone">Ве молиме внесете телефонски број</div>
                                </div>

                                <div class="form-group">
                                    <label>Преферирам контакт преку</label>
                                    <div class="contact-methods">
                                        <label class="contact-method-option selected">
                                            <input type="radio" name="contactMethod" value="phone" checked>
                                            <span>📞 Телефон</span>
                                        </label>
                                        <label class="contact-method-option">
                                            <input type="radio" name="contactMethod" value="email">
                                            <span>✉️ Емаил</span>
                                        </label>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label>Дополнителна порака (опционално)</label>
                                    <textarea class="form-textarea" id="contactMessage" placeholder="Напишете ја вашата порака овде..."></textarea>
                                </div>
                            </div>

                            <div class="form-footer">
                                <button type="button" class="btn-cancel" id="btnCancel">Откажи</button>
                                <button type="submit" class="btn-submit" id="btnSubmit">
                                    <span id="submitText">Испрати барање</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', formHTML);
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
    }

    show(apartment) {
        if (!apartment) {
            console.error('No apartment data provided');
            return;
        }

        this.currentApartment = apartment;
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

    populateApartmentInfo(apartment) {
        const infoContainer = document.getElementById('apartmentInfo');
        if (!infoContainer) return;

        const apartmentData = apartment.data || {};

        let infoHTML = '';

        if (apartment.id) {
            infoHTML += `<div class="apartment-info-item"><strong>Стан:</strong> ${apartment.id}</div>`;
        }

        Object.entries(apartmentData).forEach(([key, value]) => {
            if (key && value && key.toLowerCase() !== 'статус') {
                infoHTML += `<div class="apartment-info-item"><strong>${key}:</strong> ${value}</div>`;
            }
        });

        infoContainer.innerHTML = infoHTML;
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

        if (!phone.value.trim()) {
            this.showFieldError('contactPhone', 'errorPhone');
            isValid = false;
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
            apartment_floor: this.extractFloorNumber(apartmentData),
            apartment_size: this.extractNumericValue(apartmentData['Вкупна површина'], 'm²'),
            apartment_price: this.extractNumericValue(apartmentData['Цена'], '€'),
            apartment_bedrooms: this.extractNumericValue(apartmentData['Спални'], ''),
            contact_name: document.getElementById('contactName').value.trim(),
            contact_email: document.getElementById('contactEmail').value.trim(),
            contact_phone: document.getElementById('contactPhone').value.trim(),
            preferred_contact_method: document.querySelector('input[name="contactMethod"]:checked')?.value || 'phone',
            message: document.getElementById('contactMessage').value.trim(),
            source: `${window.location.pathname} - ${this.currentApartment?.view || 'View 1'}`
        };

        try {
            let bitrixLeadId = null;
            let bitrixError = null;

            if (window.bitrixIntegration?.isConfigured) {
                try {
                    const bitrixResult = await window.bitrixIntegration.createLead(leadData);
                    bitrixLeadId = bitrixResult.bitrixLeadId;
                    console.log('✅ Lead created in Bitrix:', bitrixLeadId);
                } catch (error) {
                    console.warn('Bitrix integration failed, continuing with local storage:', error);
                    bitrixError = error.message;
                }
            }

            leadData.bitrix_lead_id = bitrixLeadId;

            const supabaseLead = await window.supabaseCRM.createLead(leadData);
            console.log('✅ Lead saved to Supabase:', supabaseLead.id);

            await window.supabaseCRM.logSync({
                sync_type: 'lead_create',
                entity_type: 'lead',
                entity_id: supabaseLead.id,
                bitrix_id: bitrixLeadId,
                status: bitrixLeadId ? 'success' : 'failed',
                request_payload: leadData,
                error_message: bitrixError
            });

            this.showSuccessMessage('✅ Вашето барање е успешно испратено! Наш тим ќе ве контактира наскоро.');

            setTimeout(() => {
                this.hide();
            }, 3000);

        } catch (error) {
            console.error('Error submitting lead:', error);
            this.showErrorMessage('❌ Се случи грешка. Ве молиме обидете се повторно или контактирајте не директно.');
        } finally {
            this.isSubmitting = false;
            this.setSubmitButtonLoading(false);
        }
    }

    extractFloorNumber(data) {
        const floorStr = data['Кат'] || data['Спрат'] || '';
        const match = floorStr.match(/\d+/);
        return match ? parseInt(match[0]) : null;
    }

    extractNumericValue(str, suffix) {
        if (!str) return null;
        const numStr = str.replace(suffix, '').replace(/,/g, '').trim();
        const num = parseFloat(numStr);
        return isNaN(num) ? null : num;
    }

    setSubmitButtonLoading(loading) {
        const submitBtn = document.getElementById('btnSubmit');
        const submitText = document.getElementById('submitText');

        if (submitBtn) {
            submitBtn.disabled = loading;
            if (loading) {
                submitText.innerHTML = '<span class="loading-spinner"></span>Се испраќа...';
            } else {
                submitText.textContent = 'Испрати барање';
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
