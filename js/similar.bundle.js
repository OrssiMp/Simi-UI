/**
 * Simi UI - Bundle JavaScript Principal
 * Version: 1.0.0
 * Description: Bibliothèque JavaScript pour tous les composants interactifs de Simi UI
 * Basé sur similar.css (Bootstrap 5.3.7 + Tailwind CSS 3.4.17)
 */

(function(window, document) {
    'use strict';

    /**
     * Objet principal Simi UI
     * Contient toutes les fonctionnalités et composants
     */
    const SimiUI = {
        version: '1.0.0',
        
        /**
         * Initialisation de tous les composants
         */
        init: function() {
            this.initModals();
            this.initDropdowns();
            this.initTooltips();
            this.initAlerts();
            this.initTabs();
            this.initAccordions();
            this.initToasts();
            console.log('Simi UI v' + this.version + ' initialisé');
        },

        /**
         * GESTION DES MODALES
         * Ouvre et ferme les fenêtres modales
         */
        initModals: function() {
            // Sélectionner tous les déclencheurs de modales
            const modalTriggers = document.querySelectorAll('[data-simi-modal]');
            
            modalTriggers.forEach(trigger => {
                trigger.addEventListener('click', function(e) {
                    e.preventDefault();
                    const modalId = this.getAttribute('data-simi-modal');
                    SimiUI.openModal(modalId);
                });
            });

            // Boutons de fermeture
            const closeButtons = document.querySelectorAll('[data-simi-modal-close]');
            closeButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    const modal = this.closest('.simi-modal-overlay');
                    if (modal) {
                        SimiUI.closeModal(modal.id);
                    }
                });
            });

            // Fermer en cliquant sur l'overlay
            const overlays = document.querySelectorAll('.simi-modal-overlay');
            overlays.forEach(overlay => {
                overlay.addEventListener('click', function(e) {
                    if (e.target === this) {
                        SimiUI.closeModal(this.id);
                    }
                });
            });

            // Fermer avec la touche Escape
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    const activeModal = document.querySelector('.simi-modal-overlay.active');
                    if (activeModal) {
                        SimiUI.closeModal(activeModal.id);
                    }
                }
            });
        },

        /**
         * Ouvrir une modale
         * @param {string} modalId - ID de la modale à ouvrir
         */
        openModal: function(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Événement personnalisé
                const event = new CustomEvent('simi:modal:opened', { detail: { modalId } });
                document.dispatchEvent(event);
            }
        },

        /**
         * Fermer une modale
         * @param {string} modalId - ID de la modale à fermer
         */
        closeModal: function(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
                
                // Événement personnalisé
                const event = new CustomEvent('simi:modal:closed', { detail: { modalId } });
                document.dispatchEvent(event);
            }
        },

        /**
         * GESTION DES DROPDOWNS
         * Menus déroulants interactifs
         */
        initDropdowns: function() {
            const dropdownTriggers = document.querySelectorAll('[data-simi-dropdown]');
            
            dropdownTriggers.forEach(trigger => {
                trigger.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const dropdown = this.closest('.simi-dropdown');
                    const isActive = dropdown.classList.contains('active');
                    
                    // Fermer tous les autres dropdowns
                    document.querySelectorAll('.simi-dropdown.active').forEach(d => {
                        d.classList.remove('active');
                    });
                    
                    // Toggle le dropdown actuel
                    if (!isActive) {
                        dropdown.classList.add('active');
                    }
                });
            });

            // Fermer les dropdowns en cliquant ailleurs
            document.addEventListener('click', function() {
                document.querySelectorAll('.simi-dropdown.active').forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            });
        },

        /**
         * GESTION DES TOOLTIPS
         * Infobulles au survol
         */
        initTooltips: function() {
            const tooltipElements = document.querySelectorAll('[data-simi-tooltip]');
            
            tooltipElements.forEach(element => {
                const tooltipText = element.getAttribute('data-simi-tooltip');
                const position = element.getAttribute('data-tooltip-position') || 'top';
                
                // Créer le tooltip
                const tooltip = document.createElement('div');
                tooltip.className = 'simi-tooltip simi-tooltip-' + position;
                tooltip.textContent = tooltipText;
                
                // Wrapper pour le positionnement
                if (!element.classList.contains('simi-tooltip-wrapper')) {
                    const wrapper = document.createElement('span');
                    wrapper.className = 'simi-tooltip-wrapper';
                    element.parentNode.insertBefore(wrapper, element);
                    wrapper.appendChild(element);
                    wrapper.appendChild(tooltip);
                }
            });
        },

        /**
         * GESTION DES ALERTES
         * Messages d'alerte avec fermeture
         */
        initAlerts: function() {
            const alertCloseButtons = document.querySelectorAll('.simi-alert-close');
            
            alertCloseButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    const alert = this.closest('.simi-alert');
                    if (alert) {
                        SimiUI.closeAlert(alert);
                    }
                });
            });
        },

        /**
         * Fermer une alerte avec animation
         * @param {HTMLElement} alert - Élément d'alerte à fermer
         */
        closeAlert: function(alert) {
            alert.style.opacity = '0';
            alert.style.transform = 'translateX(100%)';
            
            setTimeout(() => {
                alert.remove();
            }, 300);
        },

        /**
         * Créer une alerte dynamiquement
         * @param {string} message - Message de l'alerte
         * @param {string} type - Type d'alerte (success, danger, warning, info)
         * @param {number} duration - Durée d'affichage en ms (0 = permanent)
         */
        createAlert: function(message, type = 'info', duration = 5000) {
            const alert = document.createElement('div');
            alert.className = 'simi-alert simi-alert-' + type;
            alert.innerHTML = `
                <span>${message}</span>
                <button class="simi-alert-close">&times;</button>
            `;
            
            document.body.appendChild(alert);
            
            // Initialiser le bouton de fermeture
            const closeBtn = alert.querySelector('.simi-alert-close');
            closeBtn.addEventListener('click', () => SimiUI.closeAlert(alert));
            
            // Auto-fermeture
            if (duration > 0) {
                setTimeout(() => {
                    SimiUI.closeAlert(alert);
                }, duration);
            }
            
            return alert;
        },

        /**
         * GESTION DES ONGLETS
         * Navigation par onglets
         */
        initTabs: function() {
            const tabButtons = document.querySelectorAll('[data-simi-tab]');
            
            tabButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const targetId = this.getAttribute('data-simi-tab');
                    const tabGroup = this.closest('[data-simi-tab-group]');
                    
                    if (!tabGroup) return;
                    
                    // Désactiver tous les onglets du groupe
                    tabGroup.querySelectorAll('[data-simi-tab]').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    
                    // Activer l'onglet cliqué
                    this.classList.add('active');
                    
                    // Masquer tous les contenus
                    const tabContents = document.querySelectorAll('[data-simi-tab-content]');
                    tabContents.forEach(content => {
                        content.classList.remove('active');
                        content.style.display = 'none';
                    });
                    
                    // Afficher le contenu ciblé
                    const targetContent = document.getElementById(targetId);
                    if (targetContent) {
                        targetContent.classList.add('active');
                        targetContent.style.display = 'block';
                    }
                });
            });
        },

        /**
         * GESTION DES ACCORDÉONS
         * Panneaux pliables/dépliables
         */
        initAccordions: function() {
            const accordionHeaders = document.querySelectorAll('[data-simi-accordion-header]');
            
            accordionHeaders.forEach(header => {
                header.addEventListener('click', function() {
                    const accordionItem = this.closest('[data-simi-accordion-item]');
                    const content = accordionItem.querySelector('[data-simi-accordion-content]');
                    const isActive = accordionItem.classList.contains('active');
                    
                    // Si l'accordéon est dans un groupe, fermer les autres
                    const group = accordionItem.closest('[data-simi-accordion-group]');
                    if (group) {
                        group.querySelectorAll('[data-simi-accordion-item].active').forEach(item => {
                            if (item !== accordionItem) {
                                item.classList.remove('active');
                                const otherContent = item.querySelector('[data-simi-accordion-content]');
                                otherContent.style.maxHeight = '0';
                            }
                        });
                    }
                    
                    // Toggle l'accordéon actuel
                    accordionItem.classList.toggle('active');
                    
                    if (!isActive) {
                        content.style.maxHeight = content.scrollHeight + 'px';
                    } else {
                        content.style.maxHeight = '0';
                    }
                });
            });
        },

        /**
         * GESTION DES TOASTS
         * Notifications temporaires
         */
        initToasts: function() {
            // Créer le conteneur de toasts s'il n'existe pas
            if (!document.getElementById('simi-toast-container')) {
                const container = document.createElement('div');
                container.id = 'simi-toast-container';
                container.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 9999;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                `;
                document.body.appendChild(container);
            }
        },

        /**
         * Afficher un toast
         * @param {string} message - Message du toast
         * @param {string} type - Type de toast (success, error, warning, info)
         * @param {number} duration - Durée d'affichage en ms
         */
        showToast: function(message, type = 'info', duration = 3000) {
            const container = document.getElementById('simi-toast-container');
            
            const toast = document.createElement('div');
            toast.className = 'simi-toast simi-toast-' + type;
            toast.style.cssText = `
                padding: 1rem 1.5rem;
                background-color: white;
                border-left: 4px solid;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                min-width: 300px;
                animation: slideInRight 0.3s ease;
            `;
            
            // Couleur de bordure selon le type
            const colors = {
                success: '#198754',
                error: '#dc3545',
                warning: '#ffc107',
                info: '#0dcaf0'
            };
            toast.style.borderLeftColor = colors[type] || colors.info;
            
            toast.textContent = message;
            
            container.appendChild(toast);
            
            // Animation de sortie et suppression
            setTimeout(() => {
                toast.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    toast.remove();
                }, 300);
            }, duration);
        },

        /**
         * UTILITAIRES
         */
        
        /**
         * Copier du texte dans le presse-papiers
         * @param {string} text - Texte à copier
         */
        copyToClipboard: function(text) {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => {
                    this.showToast('Copié dans le presse-papiers!', 'success', 2000);
                });
            } else {
                // Fallback pour les navigateurs plus anciens
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                this.showToast('Copié dans le presse-papiers!', 'success', 2000);
            }
        },

        /**
         * Smooth scroll vers un élément
         * @param {string} targetId - ID de l'élément cible
         */
        scrollTo: function(targetId) {
            const element = document.getElementById(targetId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    // Ajouter les animations CSS nécessaires
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Initialiser automatiquement au chargement du DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => SimiUI.init());
    } else {
        SimiUI.init();
    }

    // Exposer SimiUI globalement
    window.SimiUI = SimiUI;

})(window, document);
