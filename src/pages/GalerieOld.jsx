import React, { useState } from "react";
import { Button } from "../components/ui";
import GalerieAdmin from "../components/GalerieAdmin";

export default function Galerie() {
  const [selectedMedia, setSelectedMedia] = React.useState(null);
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [imageSize, setImageSize] = React.useState({ width: "80vw", height: "80vh" });
  const [isAdminMode, setIsAdminMode] = React.useState(false);

  // Images à exclure (affiches et plans)
  const excludedImages = [
    'affiche-montee-n3.jpg',
    'bbq-affiche.jpg', 
    'aire-sportive-p-verite.jpg'
  ];

  // Fonction pour filtrer les images indésirables
  const filterImages = (images) => {
    return images.filter(img => !excludedImages.some(excluded => img.src.includes(excluded)));
  };

  // Fonction pour calculer la taille optimale en fonction de la qualité de l'image
  const calculateOptimalSize = (img) => {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => {
        const { naturalWidth, naturalHeight } = image;
        const aspectRatio = naturalWidth / naturalHeight;
        
        // Calculer un score de qualité basé sur la résolution
        const totalPixels = naturalWidth * naturalHeight;
        let sizePercentage;
        
        if (totalPixels < 100000) { // < 100k pixels (très basse qualité)
          sizePercentage = 30;
        } else if (totalPixels < 300000) { // < 300k pixels (basse qualité)
          sizePercentage = 40;
        } else if (totalPixels < 800000) { // < 800k pixels (qualité moyenne)
          sizePercentage = 55;
        } else if (totalPixels < 2000000) { // < 2M pixels (bonne qualité)
          sizePercentage = 70;
        } else { // >= 2M pixels (haute qualité)
          sizePercentage = 80;
        }
        
        // Ajuster en fonction du ratio d'aspect
        let width, height;
        if (aspectRatio > 1.5) { // Image très large
          width = `${sizePercentage}vw`;
          height = `${Math.min(sizePercentage * 0.6, 80)}vh`;
        } else if (aspectRatio < 0.7) { // Image très haute
          width = `${Math.min(sizePercentage * 0.6, 80)}vw`;
          height = `${sizePercentage}vh`;
        } else { // Image équilibrée
          width = `${Math.min(sizePercentage * 0.8, 80)}vw`;
          height = `${Math.min(sizePercentage * 0.8, 80)}vh`;
        }
        
        resolve({ width, height });
      };
      image.onerror = () => {
        // En cas d'erreur, utiliser une taille par défaut
        resolve({ width: "50vw", height: "50vh" });
      };
      image.src = img.src;
    });
  };

  // États pour les données modifiables de la galerie
  const [mediaContent, setMediaContent] = React.useState(() => {
    const saved = localStorage.getItem('galerie-media-content');
    return saved ? JSON.parse(saved) : {
      tournois: [
        {
          id: 1,
          title: "Tournoi interne du club - Juin 2026",
          src: "/images/galerie/tournois/tournoi-fin-saison-2026.jpg",
          alt: "Affiche tournoi fin de saison",
          caption: "Tournoi de fin de saison avec barbecue convivial",
          date: "2026-06-15",
          type: "affiche"
        },
        {
          id: 2,
          title: "Barbecue du club",
          src: "/images/galerie/tournois/bbq-affiche.jpg",
          alt: "Affiche barbecue",
          caption: "Invitation au barbecue du club",
          date: "2025-06-15",
          type: "affiche"
        },
        {
          id: 3,
          title: "Tournoi de l'Avent - 13 Décembre",
          src: "/images/galerie/tournois/tournoi-avent-13dec.jpg",
          alt: "Tournoi de l'Avent",
          caption: "Tournoi festif de fin d'année",
          date: "2025-12-13"
        },
        {
          id: 4,
          title: "Tournoi de l'Avent 2019",
          src: "/images/galerie/tournois/tournoi-avent-2019.jpg",
          alt: "Tournoi de l'Avent 2019",
          caption: "Édition 2019 du tournoi traditionnel",
          date: "2019-12-15"
        },
        {
          id: 5,
          title: "Tournoi Doubles Cormery 2025",
          src: "/images/galerie/tournois/tournoi-doubles-cormery-2025.png",
          alt: "Tournoi Doubles Cormery 2025",
          caption: "Compétition de doubles inter-clubs",
          date: "2025-05-20"
        },
        {
          id: 6,
          title: "Tournoi Ludovic Bayard 2025",
          src: "/images/galerie/tournois/tournoi-ludovic-bayard-2025.jpg",
          alt: "Tournoi Ludovic Bayard 2025",
          caption: "Tournoi en mémoire de Ludovic Bayard",
          date: "2025-03-15"
        },
        {
          id: 7,
          title: "Coupe Davis",
          src: "/images/galerie/tournois/coupe-davis.png",
          alt: "Coupe Davis",
          caption: "Compétition prestigieuse de tennis de table",
          date: "2025-02-10"
        }
      ],
      matchs: [
        {
          id: 8,
          title: "Action de Match",
          src: "/images/galerie/matchs/img-2596.jpg",
          alt: "Match de championnat",
          caption: "Moment intense lors d'un match de championnat",
          date: "2024-11-15"
        },
        {
          id: 9,
          title: "Échange Tendu",
          src: "/images/galerie/matchs/img-2598.jpg",
          alt: "Échange tendu",
          caption: "Concentration maximale des joueurs",
          date: "2024-11-10"
        },
        {
          id: 10,
          title: "Service Puissant",
          src: "/images/galerie/matchs/img-2609.jpg",
          alt: "Service puissant",
          caption: "Technique de service en action",
          date: "2024-10-28"
        },
        {
          id: 11,
          title: "Défense Spectaculaire",
          src: "/images/galerie/matchs/img-2612.jpg",
          alt: "Défense spectaculaire",
          caption: "Geste défensif remarquable",
          date: "2024-10-20"
        },
        {
          id: 12,
          title: "Victoire Méritée",
          src: "/images/galerie/matchs/img-2623.jpg",
          alt: "Victoire méritée",
          caption: "Joie après une belle victoire",
          date: "2024-10-15"
        }
      ],
      equipes: [
        {
          id: 13,
          title: "Équipe D1600 - Cyrille",
          src: "/images/galerie/equipes/equipe-d1600-cyrille-2015-2016.jpg",
          alt: "Équipe D1600 Cyrille 2015-2016",
          caption: "Saison 2015-2016 - Division 1600",
          date: "2016-05-15"
        },
        {
          id: 14,
          title: "Équipe D2 - Cyrille",
          src: "/images/galerie/equipes/equipe-d2-cyrille-2019-2020.jpg",
          alt: "Équipe D2 Cyrille 2019-2020",
          caption: "Saison 2019-2020 - Division 2",
          date: "2020-05-15"
        },
        {
          id: 15,
          title: "Équipe D3 - Philippe",
          src: "/images/galerie/equipes/equipe-d3-philippe-2018-2019.jpg",
          alt: "Équipe D3 Philippe 2018-2019",
          caption: "Saison 2018-2019 - Division 3",
          date: "2019-05-15"
        },
        {
          id: 16,
          title: "Équipe D3 - Philippe",
          src: "/images/galerie/equipes/equipe-d3-philippe-2019-2020.jpg",
          alt: "Équipe D3 Philippe 2019-2020",
          caption: "Saison 2019-2020 - Division 3",
          date: "2020-05-15"
        },
        {
          id: 17,
          title: "Équipes Jeunes",
          src: "/images/galerie/equipes/equipes-jeunes-2018-2019.jpg",
          alt: "Équipes Jeunes 2018-2019",
          caption: "Saison 2018-2019 - Formation jeunesse",
          date: "2019-05-15"
        }
      ],
      divers: [
        {
          id: 18,
          title: "Affiche Montée N3",
          src: "/images/galerie/divers/affiche-montee-n3.jpg",
          alt: "Affiche Montée N3",
          caption: "Annonce de la montée en Nationale 3",
          date: "2024-06-15",
          type: "affiche"
        },
        {
          id: 19,
          title: "Article Montée N3",
          src: "/images/galerie/divers/article-montee-n3.jpg",
          alt: "Article Montée N3",
          caption: "Célébration de la montée en Nationale 3",
          date: "2024-06-15"
        },
        {
          id: 20,
          title: "Soirée Fléchettes",
          src: "/images/galerie/divers/flechettes-1.jpg",
          alt: "Soirée Fléchettes",
          caption: "Activité conviviale entre membres",
          date: "2024-03-20"
        },
        {
          id: 21,
          title: "Compétition Fléchettes",
          src: "/images/galerie/divers/flechettes-2.jpg",
          alt: "Compétition Fléchettes",
          caption: "Tournoi amical de fléchettes",
          date: "2024-03-20"
        },
        {
          id: 22,
          title: "Réception à Bourbourg",
          src: "/images/galerie/divers/reception-bourbourg.jpg",
          alt: "Réception Bourbourg",
          caption: "Accueil chaleureux lors d'un déplacement",
          date: "2024-01-15"
        },
        {
          id: 23,
          title: "Repas Convivial",
          src: "/images/galerie/divers/repas-flechettes.jpg",
          alt: "Repas Fléchettes",
          caption: "Moment de partage autour d'un repas",
          date: "2024-01-15"
        }
      ],
      voyages: [
        {
          id: 24,
          title: "Voyage Nord",
          src: "/images/galerie/voyages/usrttnord.png",
          alt: "US Renaudine TT Nord",
          caption: "Déplacement dans le Nord de la France",
          date: "2024-02-10"
        }
      ],
      evenements: [
        {
          id: 25,
          title: "Aire Sportive Pierre Vérité",
          src: "/images/galerie/evenements/aire-sportive-p-verite.jpg",
          alt: "Aire Sportive Pierre Vérité",
          caption: "Vue d'ensemble de nos installations",
          date: "2024-01-01",
          type: "plan"
        }
      ]
    };
  });

  const [categories, setCategories] = React.useState(() => {
    const saved = localStorage.getItem('galerie-categories');
    return saved ? JSON.parse(saved) : [
      { 
        id: "tournois", 
        label: "Tournois", 
        icon: "🏆",
        thumbnail: "/images/galerie/tournois/tournoi-fin-saison-2026.jpg",
        description: "Affiches et compétitions officielles"
      },
      { 
        id: "matchs", 
        label: "Matchs", 
        icon: "⚡",
        thumbnail: "/images/galerie/matchs/img-2596.jpg",
        description: "Photos d'action en compétition"
      },
      { 
        id: "equipes", 
        label: "Équipes", 
        icon: "👥",
        thumbnail: "/images/galerie/equipes/equipes-jeunes-2018-2019.jpg",
        description: "Photos officielles des équipes"
      },
      { 
        id: "divers", 
        label: "Divers", 
        icon: "🎯",
        thumbnail: "/images/galerie/divers/flechettes-1.jpg",
        description: "Événements et moments conviviaux"
      },
      { 
        id: "voyages", 
        label: "Voyages", 
        icon: "🚌",
        thumbnail: "/images/galerie/voyages/usrttnord.png",
        description: "Déplacements et rencontres"
      },
      { 
        id: "evenements", 
        label: "Événements", 
        icon: "🏢",
        thumbnail: "/images/galerie/evenements/aire-sportive-p-verite.jpg",
        description: "Infrastructure et lieux"
      }
    ];
  });

  // Sauvegarder les modifications dans localStorage
  React.useEffect(() => {
    localStorage.setItem('galerie-media-content', JSON.stringify(mediaContent));
  }, [mediaContent]);

  React.useEffect(() => {
    localStorage.setItem('galerie-categories', JSON.stringify(categories));
  }, [categories]);

  // Galerie complète avec toutes les 26 images récupérées du site
  // (Remplacé par les états mediaContent et categories ci-dessus)
    tournois: [
      {
        id: 1,
        title: "Tournoi interne du club - Juin 2026",
        src: "/images/galerie/tournois/tournoi-fin-saison-2026.jpg",
        alt: "Affiche tournoi fin de saison",
        caption: "Tournoi de fin de saison avec barbecue convivial",
        date: "2026-06-15",
        type: "affiche"
      },
      {
        id: 2,
        title: "Barbecue du club",
        src: "/images/galerie/tournois/bbq-affiche.jpg",
        alt: "Affiche barbecue",
        caption: "Invitation au barbecue du club",
        date: "2025-06-15",
        type: "affiche"
      },
      {
        id: 3,
        title: "Tournoi Ludovic Bayard - Parçay-Meslay",
        src: "/images/galerie/tournois/tournoi-ludovic-bayard-2025.jpg",
        alt: "Tournoi Ludovic Bayard",
        caption: "Tournoi en mémoire de Ludovic Bayard",
        date: "2025-04-26",
        type: "affiche"
      },
      {
        id: 4,
        title: "Tournoi amical de doubles - Cormery-Truyes",
        src: "/images/galerie/tournois/tournoi-doubles-cormery-2025.png",
        alt: "Tournoi doubles Cormery",
        caption: "Tournoi amical de doubles - Format convivial",
        date: "2025-04-27",
        type: "affiche"
      },
      {
        id: 5,
        title: "Coupe Mixte Départementale",
        src: "/images/galerie/tournois/coupe-davis.png",
        alt: "Coupe Davis",
        caption: "Compétition officielle FFTT - Équipes mixtes",
        date: "2025-04-15",
        type: "competition"
      },
      {
        id: 6,
        title: "Tournoi de l'Avent 2019",
        src: "/images/galerie/tournois/tournoi-avent-2019.jpg",
        alt: "Tournoi Avent 2019",
        caption: "Article Nouvelle République - Tournoi de Noël réussi",
        date: "2019-12-11",
        type: "presse"
      },
      {
        id: 7,
        title: "Tournoi de l'Avent - 13 décembre",
        src: "/images/galerie/tournois/tournoi-avent-13dec.jpg",
        alt: "Tournoi Avent 13 décembre",
        caption: "Affiche du tournoi de l'Avent organisé par le club",
        date: "2019-12-13",
        type: "affiche"
      }
    ],
    matchs: [
      {
        id: 8,
        title: "Match R1/R3 - 22 septembre 2019",
        src: "/images/galerie/matchs/img-2596.jpg",
        alt: "Photo match R1 R3",
        caption: "Photos du match régional R1/R3 du 22 septembre 2019",
        date: "2019-09-22",
        type: "match"
      },
      {
        id: 9,
        title: "Action de jeu R1/R3",
        src: "/images/galerie/matchs/img-2598.jpg",
        alt: "Action de jeu",
        caption: "Moment d'action pendant le match R1/R3",
        date: "2019-09-22",
        type: "match"
      },
      {
        id: 10,
        title: "Échange intense R1/R3",
        src: "/images/galerie/matchs/img-2609.jpg",
        alt: "Échange tennis de table",
        caption: "Échange spectaculaire lors du match régional",
        date: "2019-09-22",
        type: "match"
      },
      {
        id: 11,
        title: "Concentration R1/R3",
        src: "/images/galerie/matchs/img-2612.jpg",
        alt: "Joueur concentré",
        caption: "Moment de concentration pendant la compétition",
        date: "2019-09-22",
        type: "match"
      },
      {
        id: 12,
        title: "Ambiance match R1/R3",
        src: "/images/galerie/matchs/img-2623.jpg",
        alt: "Ambiance match",
        caption: "Ambiance et public lors du match régional",
        date: "2019-09-22",
        type: "match"
      }
    ],
    equipes: [
      {
        id: 13,
        title: "Équipe jeunes 2018/2019",
        src: "/images/galerie/equipes/equipes-jeunes-2018-2019.jpg",
        alt: "Équipe jeunes",
        caption: "Photo officielle de l'équipe jeunes saison 2018/2019",
        date: "2019-06-15",
        type: "equipe"
      },
      {
        id: 14,
        title: "Équipe D3 Philippe 2018/2019",
        src: "/images/galerie/equipes/equipe-d3-philippe-2018-2019.jpg",
        alt: "Équipe D3 Philippe",
        caption: "Équipe D3 encadrée par Philippe - saison 2018/2019",
        date: "2019-06-15",
        type: "equipe"
      },
      {
        id: 15,
        title: "Équipe D3 Philippe 2019/2020",
        src: "/images/galerie/equipes/equipe-d3-philippe-2019-2020.jpg",
        alt: "Équipe D3 Philippe 2019",
        caption: "Équipe D3 Philippe - saison 2019/2020",
        date: "2020-06-15",
        type: "equipe"
      },
      {
        id: 16,
        title: "Équipe D1600 Cyrille 2015/2016",
        src: "/images/galerie/equipes/equipe-d1600-cyrille-2015-2016.jpg",
        alt: "Équipe D1600 Cyrille",
        caption: "Équipe D1600 encadrée par Cyrille - saison 2015/2016",
        date: "2016-06-15",
        type: "equipe"
      },
      {
        id: 17,
        title: "Équipe D2 Cyrille 2019/2020",
        src: "/images/galerie/equipes/equipe-d2-cyrille-2019-2020.jpg",
        alt: "Équipe D2 Cyrille",
        caption: "Équipe D2 Cyrille - saison 2019/2020",
        date: "2020-06-15",
        type: "equipe"
      }
    ],
    divers: [
      {
        id: 18,
        title: "Article montée Nationale 3",
        src: "/images/galerie/divers/article-montee-n3.jpg",
        alt: "Article montée N3",
        caption: "Article de presse célébrant la montée en Nationale 3",
        date: "2023-12-15",
        type: "presse"
      },
      {
        id: 19,
        title: "Affiche montée Nationale 3",
        src: "/images/galerie/divers/affiche-montee-n3.jpg",
        alt: "Affiche montée N3",
        caption: "Affiche officielle de la montée en Nationale 3",
        date: "2024-01-15",
        type: "affiche"
      },
      {
        id: 20,
        title: "Réception club de Bourbourg",
        src: "/images/galerie/divers/reception-bourbourg.jpg",
        alt: "Réception Bourbourg",
        caption: "Réception du club de Bourbourg - échange amical",
        date: "2024-06-15",
        type: "evenement"
      },
      {
        id: 21,
        title: "Tournoi de fléchettes 2024",
        src: "/images/galerie/divers/flechettes-1.jpg",
        alt: "Tournoi fléchettes",
        caption: "Tournoi de fléchettes organisé par le club",
        date: "2024-11-15",
        type: "evenement"
      },
      {
        id: 22,
        title: "Animation fléchettes",
        src: "/images/galerie/divers/flechettes-2.jpg",
        alt: "Animation fléchettes",
        caption: "Moment convivial du tournoi de fléchettes",
        date: "2024-11-15",
        type: "evenement"
      },
      {
        id: 23,
        title: "Repas tournoi fléchettes",
        src: "/images/galerie/divers/repas-flechettes.jpg",
        alt: "Repas fléchettes",
        caption: "Repas convivial après le tournoi de fléchettes",
        date: "2024-11-15",
        type: "evenement"
      }
    ],
    voyages: [
      {
        id: 24,
        title: "Séjour dans le Nord - Oudezeele",
        src: "/images/galerie/voyages/usrttnord.png",
        alt: "Voyage Nord",
        caption: "Week-end de l'Ascension dans le Nord - Rencontre avec Bourbourg",
        date: "2022-05-26",
        type: "voyage"
      }
    ],
    evenements: [
      {
        id: 25,
        title: "Aire sportive Pierre Verite",
        src: "/images/galerie/evenements/aire-sportive-p-verite.jpg",
        alt: "Aire sportive Pierre Verite",
        caption: "Notre salle d'entraînement à Château-Renault",
        date: "2025-04-27",
        type: "infrastructure"
      }
    ],
    videos: [
      {
        id: 26,
        title: "Chaîne YouTube USRenaudineTT",
        videoId: "UCf-BPCtgxwRBc0Ovm10UYIg", // Channel ID
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg", // Placeholder
        caption: "Matchs en direct, highlights et interviews",
        date: "2022-10-28",
        type: "video",
        link: "https://www.youtube.com/channel/UCf-BPCtgxwRBc0Ovm10UYIg"
      }
    ]
  };

  // Catégories avec vignettes
  const categories = [
    { 
      id: "tournois", 
      label: "Tournois", 
      icon: "🏆",
      thumbnail: "/images/galerie/tournois/tournoi-fin-saison-2026.jpg",
      description: "Affiches et compétitions officielles"
    },
    { 
      id: "matchs", 
      label: "Matchs", 
      icon: "⚡",
      thumbnail: "/images/galerie/matchs/img-2596.jpg",
      description: "Photos d'action en compétition"
    },
    { 
      id: "equipes", 
      label: "Équipes", 
      icon: "👥",
      thumbnail: "/images/galerie/equipes/equipes-jeunes-2018-2019.jpg",
      description: "Photos officielles des équipes"
    },
    { 
      id: "divers", 
      label: "Divers", 
      icon: "🎯",
      thumbnail: "/images/galerie/divers/flechettes-1.jpg",
      description: "Événements et moments conviviaux"
    },
    { 
      id: "voyages", 
      label: "Voyages", 
      icon: "🚌",
      thumbnail: "/images/galerie/voyages/usrttnord.png",
      description: "Déplacements et rencontres"
    },
    { 
      id: "evenements", 
      label: "Événements", 
      icon: "🏢",
      thumbnail: "/images/galerie/evenements/aire-sportive-p-verite.jpg",
      description: "Infrastructure et lieux"
    }
  ];

  const openCategory = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const closeCategory = () => {
    setSelectedCategory(null);
  };

  const openModal = async (media) => {
    setSelectedMedia(media);
    // Trouver l'index de l'image dans la catégorie actuelle
    if (selectedCategory) {
      const filteredImages = getFilteredImages(selectedCategory);
      const index = filteredImages.findIndex(img => img.id === media.id);
      setCurrentImageIndex(index);
    }
    
    // Calculer la taille optimale pour cette image
    try {
      const optimalSize = await calculateOptimalSize(media);
      setImageSize(optimalSize);
    } catch (error) {
      // En cas d'erreur, utiliser une taille par défaut
      setImageSize({ width: "50vw", height: "50vh" });
    }
  };

  const closeModal = () => {
    setSelectedMedia(null);
  };

  // Fonction pour obtenir les images filtrées d'une catégorie
  const getFilteredImages = (categoryId) => {
    const images = mediaContent[categoryId] || [];
    return images.filter(img => !excludedImages.some(excluded => img.src.includes(excluded)));
  };

  // Navigation entre les images
  const goToPreviousImage = async () => {
    if (selectedCategory) {
      const filteredImages = getFilteredImages(selectedCategory);
      const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : filteredImages.length - 1;
      setCurrentImageIndex(newIndex);
      const newMedia = filteredImages[newIndex];
      setSelectedMedia(newMedia);
      
      // Recalculer la taille pour la nouvelle image
      try {
        const optimalSize = await calculateOptimalSize(newMedia);
        setImageSize(optimalSize);
      } catch (error) {
        setImageSize({ width: "50vw", height: "50vh" });
      }
    }
  };

  const goToNextImage = async () => {
    if (selectedCategory) {
      const filteredImages = getFilteredImages(selectedCategory);
      const newIndex = currentImageIndex < filteredImages.length - 1 ? currentImageIndex + 1 : 0;
      setCurrentImageIndex(newIndex);
      const newMedia = filteredImages[newIndex];
      setSelectedMedia(newMedia);
      
      // Recalculer la taille pour la nouvelle image
      try {
        const optimalSize = await calculateOptimalSize(newMedia);
        setImageSize(optimalSize);
      } catch (error) {
        setImageSize({ width: "50vw", height: "50vh" });
      }
    }
  };

    // Gestionnaire pour les événements clavier
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (selectedMedia) {
          closeModal();
        } else if (selectedCategory) {
          closeCategory();
        }
      } else if (selectedMedia && selectedCategory) {
        if (e.key === 'ArrowLeft') {
          goToPreviousImage();
        } else if (e.key === 'ArrowRight') {
          goToNextImage();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedMedia, selectedCategory, currentImageIndex]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getTypeColor = (type) => {
    const colors = {
      affiche: "#FFD700",
      competition: "#FF6B35",
      presse: "#4ECDC4",
      voyage: "#45B7D1",
      infrastructure: "#9B59B6",
      match: "#E74C3C",
      equipe: "#2ECC71",
      evenement: "#F39C12",
      video: "#96CEB4"
    };
    return colors[type] || "#ccc";
  };

  const getTypeLabel = (type) => {
    const labels = {
      affiche: "Affiche",
      competition: "Compétition",
      presse: "Presse",
      voyage: "Voyage",
      infrastructure: "Infrastructure",
      match: "Match",
      equipe: "Équipe",
      evenement: "Événement",
      video: "Vidéo"
    };
    return labels[type] || type;
  };

  return (
    <main style={{ padding: "3rem 1rem", color: "white" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 style={{ 
            fontSize: "2.5rem", 
            marginBottom: "1rem", 
            color: "var(--secondary-color)"
          }}>
            Galerie Multimédia
          </h1>
          <p style={{ 
            fontSize: "1.1rem",
            maxWidth: "800px",
            margin: "0 auto",
            lineHeight: "1.6",
            background: "rgba(255, 255, 255, 0.1)",
            padding: "1.5rem",
            borderRadius: "10px"
          }}>
            Découvrez l'histoire de l'US Renaudine Tennis de Table à travers nos **26 photos authentiques** organisées par thème.
            Cliquez sur une catégorie pour explorer les images.
          </p>
        </div>

        {/* Vignettes des catégories */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
          marginBottom: "3rem"
        }}>
          {categories.map(category => {
            const filteredImages = getFilteredImages(category.id);
            const photoCount = filteredImages.length;
            
            return (
              <div 
                key={category.id}
                style={{ 
                  position: "relative",
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "15px",
                  overflow: "hidden",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "pointer",
                  border: "1px solid rgba(255, 255, 255, 0.2)"
                }}
                onClick={() => openCategory(category.id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Nombre de photos en haut à droite */}
                <div style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: "var(--primary-color)",
                  color: "white",
                  padding: "0.3rem 0.6rem",
                  borderRadius: "12px",
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  zIndex: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
                }}>
                  {photoCount}
                </div>

                {/* Image de vignette */}
                <div style={{ position: "relative", height: "200px" }}>
                  <img
                    src={category.thumbnail}
                    alt={category.label}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div style={{
                    display: 'none',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                    color: 'white',
                    fontSize: '3rem',
                    fontWeight: 'bold'
                  }}>
                    {category.icon}
                  </div>
                  
                  {/* Overlay avec icône */}
                  <div style={{
                    position: "absolute",
                    bottom: "10px",
                    left: "10px",
                    background: "rgba(0, 0, 0, 0.7)",
                    color: "white",
                    padding: "0.5rem",
                    borderRadius: "50%",
                    fontSize: "1.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "50px",
                    height: "50px"
                  }}>
                    {category.icon}
                  </div>
                </div>

                {/* Informations de la catégorie */}
                <div style={{ padding: "1.5rem" }}>
                  <h3 style={{ 
                    margin: "0 0 0.5rem 0", 
                    color: "var(--secondary-color)",
                    fontSize: "1.3rem",
                    fontWeight: "bold"
                  }}>
                    {category.label}
                  </h3>
                  
                  <p style={{ 
                    margin: "0", 
                    color: "#ccc",
                    fontSize: "0.9rem",
                    lineHeight: "1.4"
                  }}>
                    {category.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chaîne YouTube en section séparée */}
        <div style={{
          background: "rgba(255, 255, 255, 0.1)",
          padding: "2rem",
          borderRadius: "15px",
          textAlign: "center",
          marginBottom: "3rem"
        }}>
          <h2 style={{ color: "var(--primary-color)", marginBottom: "1rem" }}>
            📹 Chaîne YouTube Officielle
          </h2>
          <p style={{ 
            marginBottom: "2rem", 
            fontSize: "1.1rem",
            maxWidth: "600px",
            margin: "0 auto 2rem"
          }}>
            Regardez nos matchs en direct, highlights et interviews sur notre chaîne YouTube officielle !
          </p>
          
          <Button 
            variant="primary" 
            onClick={() => window.open('https://www.youtube.com/channel/UCf-BPCtgxwRBc0Ovm10UYIg', '_blank')}
            style={{ fontSize: "1.1rem", padding: "1rem 2rem" }}
          >
            📺 Voir la chaîne YouTube
          </Button>
        </div>

        {/* Vue détaillée d'une catégorie */}
        {selectedCategory && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.95)",
            display: "flex",
            flexDirection: "column",
            zIndex: 1000,
            padding: "2rem",
            overflowY: "auto"
          }}
          onClick={closeCategory}
          >
            <div style={{ 
              maxWidth: "1200px", 
              margin: "0 auto",
              width: "100%"
            }}
            onClick={(e) => e.stopPropagation()}
            >
              {/* Header de la catégorie */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "2rem",
                color: "white"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ fontSize: "3rem" }}>
                    {categories.find(c => c.id === selectedCategory)?.icon}
                  </div>
                  <div>
                    <h2 style={{ 
                      margin: 0, 
                      fontSize: "2rem", 
                      color: "var(--secondary-color)"
                    }}>
                      {categories.find(c => c.id === selectedCategory)?.label}
                    </h2>
                    <p style={{ 
                      margin: "0.5rem 0 0 0", 
                      color: "#ccc",
                      fontSize: "1rem"
                    }}>
                      {getFilteredImages(selectedCategory).length} photos
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={closeCategory}
                  style={{
                    background: "var(--secondary-color)",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "50px",
                    height: "50px",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
                  }}
                >
                  ×
                </button>
              </div>

              {/* Grille des photos de la catégorie */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1.5rem"
              }}>
                {getFilteredImages(selectedCategory).map(media => (
                  <div 
                    key={media.id}
                    style={{ 
                      position: "relative",
                      background: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "10px",
                      overflow: "hidden",
                      transition: "transform 0.3s ease",
                      cursor: "pointer",
                      border: "1px solid rgba(255, 255, 255, 0.2)"
                    }}
                    onClick={() => openModal(media)}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                  >
                    <img
                      src={media.src}
                      alt={media.alt}
                      style={{
                        width: "100%",
                        height: "180px",
                        objectFit: "cover"
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div style={{
                      display: 'none',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '180px',
                      background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                      color: 'white',
                      fontSize: '2rem',
                      fontWeight: 'bold'
                    }}>
                      🏓
                    </div>
                    
                    <div style={{ padding: "1rem" }}>
                      <h4 style={{ 
                        margin: "0 0 0.5rem 0", 
                        color: "white",
                        fontSize: "1rem",
                        lineHeight: "1.3"
                      }}>
                        {media.title}
                      </h4>
                      <p style={{ 
                        margin: "0", 
                        color: "#ccc",
                        fontSize: "0.8rem",
                        lineHeight: "1.4"
                      }}>
                        {media.caption}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modale pour afficher l'image en grand */}
        {selectedMedia && selectedMedia.type !== "video" && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.95)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "2rem"
          }}
          onClick={closeModal}
          >
            <div style={{ 
              position: "relative", 
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100vh",
              width: "100%"
            }}>
              <img
                src={selectedMedia.src}
                alt={selectedMedia.alt}
                style={{
                  width: imageSize.width,
                  height: imageSize.height,
                  objectFit: "contain",
                  borderRadius: "10px",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                  transition: "all 0.3s ease"
                }}
                onClick={(e) => e.stopPropagation()}
              />
              
              <div style={{
                position: "absolute",
                bottom: "2rem",
                left: "50%",
                transform: "translateX(-50%)",
                textAlign: "center",
                color: "white",
                maxWidth: "600px",
                background: "rgba(0, 0, 0, 0.7)",
                padding: "1rem 2rem",
                borderRadius: "10px",
                backdropFilter: "blur(10px)"
              }}>
                <h3 style={{ 
                  margin: "0 0 0.5rem 0", 
                  color: "var(--secondary-color)",
                  fontSize: "1.3rem"
                }}>
                  {selectedMedia.title}
                </h3>
                <p style={{ 
                  margin: "0 0 0.5rem 0", 
                  fontSize: "1rem",
                  lineHeight: "1.4"
                }}>
                  {selectedMedia.caption}
                </p>
                {selectedMedia.date && (
                  <p style={{ 
                    margin: 0, 
                    color: "#FFD700", 
                    fontSize: "0.9rem",
                    fontWeight: "bold"
                  }}>
                    {formatDate(selectedMedia.date)}
                  </p>
                )}
                
                {/* Indicateur de position dans la série */}
                {selectedCategory && getFilteredImages(selectedCategory).length > 1 && (
                  <p style={{ 
                    margin: "1rem 0 0 0", 
                    color: "var(--secondary-color)",
                    fontSize: "0.9rem",
                    fontWeight: "bold"
                  }}>
                    {currentImageIndex + 1} / {getFilteredImages(selectedCategory).length}
                  </p>
                )}
              </div>
              
              {/* Boutons de navigation */}
              {selectedCategory && getFilteredImages(selectedCategory).length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goToPreviousImage();
                    }}
                    style={{
                      position: "fixed",
                      left: "2rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "rgba(0, 0, 0, 0.8)",
                      color: "white",
                      border: "2px solid var(--secondary-color)",
                      borderRadius: "50%",
                      width: "50px",
                      height: "50px",
                      fontSize: "1.5rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "var(--secondary-color)";
                      e.target.style.transform = "translateY(-50%) scale(1.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "rgba(0, 0, 0, 0.8)";
                      e.target.style.transform = "translateY(-50%) scale(1)";
                    }}
                  >
                    ‹
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goToNextImage();
                    }}
                    style={{
                      position: "fixed",
                      right: "2rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "rgba(0, 0, 0, 0.8)",
                      color: "white",
                      border: "2px solid var(--secondary-color)",
                      borderRadius: "50%",
                      width: "50px",
                      height: "50px",
                      fontSize: "1.5rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "var(--secondary-color)";
                      e.target.style.transform = "translateY(-50%) scale(1.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "rgba(0, 0, 0, 0.8)";
                      e.target.style.transform = "translateY(-50%) scale(1)";
                    }}
                  >
                    ›
                  </button>
                </>
              )}

              <button
                onClick={closeModal}
                style={{
                  position: "absolute",
                  top: "-15px",
                  right: "-15px",
                  background: "var(--secondary-color)",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "50px",
                  height: "50px",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
                }}
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Section d'appel à l'action */}
        <div style={{
          background: "rgba(255, 255, 255, 0.1)",
          padding: "3rem 2rem",
          borderRadius: "15px",
          textAlign: "center",
          marginTop: "3rem"
        }}>
          <h2 style={{ color: "var(--primary-color)", marginBottom: "1rem" }}>
            📸 Partagez vos souvenirs !
          </h2>
          <p style={{ 
            marginBottom: "2rem", 
            fontSize: "1.1rem",
            maxWidth: "600px",
            margin: "0 auto 2rem"
          }}>
            Vous avez participé à nos événements ? Partagez vos photos avec la communauté !
          </p>
          
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Button variant="primary" onClick={() => window.location.href = '/contact'}>
              📤 Envoyer des photos
            </Button>
            <Button variant="outline" onClick={() => window.open('https://www.facebook.com/usrtt/', '_blank')}>
              📘 Page Facebook
            </Button>
            <Button variant="outline" onClick={() => window.open('https://www.youtube.com/channel/UCf-BPCtgxwRBc0Ovm10UYIg', '_blank')}>
              📺 Chaîne YouTube
            </Button>
          </div>
        </div>

      </div>
    </main>
  );
}