import { Content } from '../models/GenericContent.js';
import mongoose from 'mongoose';
// @desc    Get content by type
// @route   GET /api/content/:type
// @access  Public
export const getContentByType = async (req, res) => {
    try {
        const { type } = req.params;
        const validTypes = ['home', 'about', 'services', 'projects', 'contact'];
        if (!validTypes.includes(type)) {
            res.status(400).json({
                success: false,
                message: 'Invalid content type'
            });
            return;
        }
        let content = await Content.findOne({ type }).select('-__v');
        // If content doesn't exist, create default content
        if (!content) {
            const defaultContent = getDefaultContent(type);
            content = new Content(defaultContent);
            await content.save();
        }
        res.status(200).json({
            success: true,
            data: content,
            message: 'Content retrieved successfully'
        });
    }
    catch (error) {
        console.error('Get content error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
// @desc    Update content by type
// @route   PUT /api/content/:type
// @access  Private (Admin)
export const updateContentByType = async (req, res) => {
    try {
        const { type } = req.params;
        const updateData = req.body;
        const validTypes = ['home', 'about', 'services'];
        if (!validTypes.includes(type)) {
            res.status(400).json({
                success: false,
                message: 'Invalid content type'
            });
            return;
        }
        let content = await Content.findOneAndUpdate({ type }, {
            ...updateData,
            type, // Ensure type doesn't change
            updatedAt: new Date()
        }, {
            new: true,
            upsert: true,
            runValidators: true
        }).select('-__v');
        res.status(200).json({
            success: true,
            data: content,
            message: 'Content updated successfully'
        });
    }
    catch (error) {
        console.error('Update content error:', error);
        if (error instanceof mongoose.Error.ValidationError) {
            const messages = Object.values(error.errors).map(err => err.message);
            res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
// @desc    Get all content types
// @route   GET /api/content
// @access  Private (Admin)
export const getAllContent = async (req, res) => {
    try {
        const content = await Content.find({}).select('-__v').sort({ type: 1 });
        res.status(200).json({
            success: true,
            data: content,
            message: 'All content retrieved successfully'
        });
    }
    catch (error) {
        console.error('Get all content error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
// Helper function to get default content for each type
const getDefaultContent = (type) => {
    const defaults = {
        home: {
            type: 'home',
            data: {
                hero: {
                    title: 'ESA - Expert en Ingénierie Structurelle',
                    subtitle: 'Solutions Innovantes pour vos Projets de Construction',
                    description: 'EZZOGHBI STRUCTURAL ANALYSIS offre des services complets d\'ingénierie structurelle avec plus de 15 ans d\'expérience dans le domaine.',
                    ctaButton1Text: 'Nos Projets',
                    ctaButton2Text: 'Nous Contacter'
                },
                statistics: {
                    experience: '15+ Années',
                    projects: '200+ Projets',
                    compliance: '100% Conformité',
                    software: 'Logiciels Avancés'
                },
                services: {
                    title: 'Nos Services',
                    description: 'Des solutions complètes pour tous vos besoins en ingénierie structurelle'
                }
            }
        },
        about: {
            type: 'about',
            data: {
                company: {
                    description: 'EZZOGHBI STRUCTURAL ANALYSIS est un bureau d\'études spécialisé dans l\'ingénierie structurelle, fondé par des experts passionnés par l\'innovation et l\'excellence technique.',
                    mission: 'Notre mission est de fournir des solutions d\'ingénierie structurelle innovantes et fiables, en respectant les plus hauts standards de qualité et de sécurité.',
                    vision: 'Devenir la référence en ingénierie structurelle en Tunisie et dans la région, reconnue pour notre expertise technique et notre approche client-centrée.',
                    values: [
                        'Excellence technique',
                        'Innovation continue',
                        'Intégrité professionnelle',
                        'Satisfaction client',
                        'Respect des délais',
                        'Conformité réglementaire'
                    ]
                },
                team: [
                    {
                        id: '1',
                        name: 'Mohamed EZZOGHBI',
                        position: 'Ingénieur Principal',
                        description: 'Expert en calcul de structures avec plus de 15 ans d\'expérience dans le domaine.',
                        email: 'mohamed@esa-structures.tn'
                    }
                ]
            }
        },
        services: {
            type: 'services',
            data: {
                intro: {
                    title: 'Nos Services d\'Ingénierie',
                    description: 'EZZOGHBI STRUCTURAL ANALYSIS propose une gamme complète de services d\'ingénierie structurelle pour répondre à tous vos besoins de construction.'
                },
                categories: [
                    {
                        id: '1',
                        title: 'Calcul de Structures',
                        description: 'Analyse et dimensionnement de structures en béton armé, acier et mixtes',
                        services: [
                            'Calcul de poutres et poteaux',
                            'Dimensionnement de dalles',
                            'Analyse sismique',
                            'Étude de fondations'
                        ]
                    },
                    {
                        id: '2',
                        title: 'Études Techniques',
                        description: 'Études approfondies pour la validation et l\'optimisation de vos projets',
                        services: [
                            'Notes de calcul détaillées',
                            'Plans d\'exécution',
                            'Expertise technique',
                            'Contrôle qualité'
                        ]
                    }
                ]
            }
        },
        projects: {
            type: 'projects',
            data: {
                hero: {
                    title: 'Nos Réalisations',
                    subtitle: 'Découvrez nos projets d\'ingénierie structurelle'
                },
                featured: {
                    title: 'Projets Phares',
                    description: 'Une sélection de nos réalisations les plus représentatives de notre expertise'
                },
                portfolio: {
                    title: 'Toutes nos Réalisations',
                    description: 'Un aperçu complet de notre portfolio de projets de structures'
                },
                cta: {
                    title: 'Votre Projet, Notre Expertise',
                    description: 'Chaque projet est unique. Découvrez comment nous pouvons adapter notre savoir-faire à vos besoins spécifiques.',
                    buttonText: 'Demander un Devis',
                    buttonLink: '/contact'
                }
            }
        },
        contact: {
            type: 'contact',
            data: {
                hero: {
                    title: 'Contactez-nous',
                    subtitle: 'Discutons de votre projet d\'ingénierie structurelle'
                },
                info: {
                    title: 'Informations de Contact',
                    address: 'Tunis, Tunisie',
                    phone: '+216 XX XXX XXX',
                    email: 'contact@esa-structures.tn',
                    workingHours: 'Lun - Ven: 8h00 - 17h30'
                },
                form: {
                    title: 'Demande de Devis',
                    description: 'Remplissez ce formulaire et nous vous contacterons dans les plus brefs délais pour discuter de votre projet.'
                },
                cta: {
                    title: 'Besoin d\'une expertise technique ?',
                    description: 'Nos ingénieurs sont à votre disposition pour étudier votre projet et vous proposer les meilleures solutions techniques.',
                    buttonText: 'Prendre Rendez-vous',
                    buttonLink: '/contact'
                }
            }
        }
    };
    return defaults[type] || { type, data: {} };
};
//# sourceMappingURL=content.js.map