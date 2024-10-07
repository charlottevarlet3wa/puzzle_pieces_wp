import PuzzlePiece from "./classes/PuzzlePiece.js";
import DropZone from "./classes/DropZone.js";

// Tableau des images disponibles
const images = [
  {
    name: "Accueil",
    src: "images/home600.png",
  },
  {
    name: "Menu",
    src: "images/barre300.png",
  },
  {
    name: "Fichiers",
    src: "images/files600.png",
  },
  {
    name: "Page Builder Elementor",
    src: "images/editor300.png",
  },
  {
    name: "Plugins",
    src: "images/plugins600.png",
  },
];

const canvas = document.getElementById("puzzleCanvas");
const ctx = canvas.getContext("2d");
const select = document.getElementById("imageSelector");
const pieceSize = 100;
let pieces = [];
const dropZones = [];
let selectedPiece = null;
let offsetX, offsetY;
let image = new Image(); // Image actuellement sélectionnée

// Remplir le select avec les options d'image
images.forEach((img, index) => {
  const option = document.createElement("option");
  option.value = index;
  option.textContent = img.name;
  select.appendChild(option);
});

// Fonction pour ajuster la taille du canvas
function resizeCanvas(width, height) {
  const canvasWidth = width + 100; // Largeur de l'image + 50px de marge de chaque côté
  const canvasHeight = height + 300 + 50; // Hauteur de l'image + espace pour les pièces + 50px de marge entre les deux
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
}

// Fonction pour mélanger aléatoirement les positions des pièces
function shufflePositions(rows, cols) {
  const positions = [];
  const puzzleStartY = image.height + 100; // Commence sous la grille avec une marge de 50px

  // Générer des positions pour chaque pièce
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = 50 + col * pieceSize; // Aligné avec la grille en X
      const y = puzzleStartY + row * pieceSize; // Commencer les pièces en bas
      positions.push({ x, y });
    }
  }

  // Mélanger les positions aléatoirement
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  return positions;
}

// Fonction pour initialiser le puzzle avec une nouvelle image
function initializePuzzle(imageSrc) {
  image.src = imageSrc;
  image.onload = function () {
    const rows = Math.floor(image.height / pieceSize);
    const cols = Math.floor(image.width / pieceSize);

    // Ajuster la taille du canvas
    resizeCanvas(image.width, image.height + 100);

    // Vider les tableaux de pièces et de zones de dépôt
    pieces = [];
    dropZones.length = 0;

    // Mélanger les positions des pièces
    const shuffledPositions = shufflePositions(rows, cols);

    // Créer les zones de dépôt (grille en haut à gauche, avec un décalage de 50px)
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        dropZones.push(
          new DropZone(
            50 + col * pieceSize, // Coordonnées X de la zone de dépôt (50px de marge à gauche)
            50 + row * pieceSize, // Coordonnées Y de la zone de dépôt (50px de marge en haut)
            pieceSize,
            pieceSize
          )
        );
      }
    }

    // Créer les pièces du puzzle avec des positions mélangées
    let shuffledIndex = 0;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const { x, y } = shuffledPositions[shuffledIndex++]; // Utiliser les positions mélangées

        const imgX = col * pieceSize;
        const imgY = row * pieceSize;

        const dropZoneIndex = row * cols + col;

        const borders = {
          top:
            row === 0
              ? "smooth"
              : pieces[(row - 1) * cols + col]?.borders.bottom === "inward"
              ? "outward"
              : "inward",
          right:
            col === cols - 1
              ? "smooth"
              : Math.random() > 0.5
              ? "inward"
              : "outward",
          bottom:
            row === rows - 1
              ? "smooth"
              : Math.random() > 0.5
              ? "inward"
              : "outward",
          left:
            col === 0
              ? "smooth"
              : pieces[row * cols + (col - 1)]?.borders.right === "inward"
              ? "outward"
              : "inward",
        };

        const piece = new PuzzlePiece(
          x,
          y,
          pieceSize,
          pieceSize,
          borders,
          image,
          imgX,
          imgY,
          dropZoneIndex
        );
        pieces.push(piece);
      }
    }

    redrawPuzzle();
  };
}

// Redessiner le puzzle
function redrawPuzzle() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  dropZones.forEach((zone) => zone.draw(ctx));

  // Dessiner toutes les pièces dans l'ordre actuel du tableau
  pieces.forEach((piece) => {
    piece.draw(ctx);
  });
}

// Vérifier si une pièce est dans une zone de dépôt
function isInDropZone(piece, dropZone) {
  const tolerance = 30;
  return (
    Math.abs(piece.x - dropZone.x) < tolerance &&
    Math.abs(piece.y - dropZone.y) < tolerance
  );
}

// Vérifier si toutes les pièces sont bien placées
function checkAllPiecesPlaced() {
  return pieces.every((piece) => {
    const dropZone = dropZones[piece.dropZone];
    return piece.x === dropZone.x && piece.y === dropZone.y;
  });
}

// Gestion du clic
canvas.addEventListener("mousedown", (e) => {
  const mouseX = e.offsetX;
  const mouseY = e.offsetY;

  // Parcourir les pièces à l'envers pour sélectionner la plus haute
  for (let i = pieces.length - 1; i >= 0; i--) {
    const piece = pieces[i];
    if (piece.isClicked(mouseX, mouseY)) {
      selectedPiece = piece; // Enregistrer la pièce sélectionnée
      offsetX = mouseX - piece.x;
      offsetY = mouseY - piece.y;
      piece.isDragging = true;

      // Déplacer la pièce sélectionnée à la fin du tableau pour la dessiner en dernier
      pieces = pieces.filter((p) => p !== selectedPiece); // Retirer la pièce
      pieces.push(selectedPiece); // Ajouter la pièce à la fin du tableau
      redrawPuzzle(); // Redessiner avec la pièce en dernier
      break;
    }
  }
});

// Gestion du déplacement de la pièce
canvas.addEventListener("mousemove", (e) => {
  if (selectedPiece && selectedPiece.isDragging) {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    selectedPiece.x = mouseX - offsetX;
    selectedPiece.y = mouseY - offsetY;

    redrawPuzzle(); // Redessiner avec la pièce sélectionnée au-dessus
  }
});

// Gestion du relâchement de la pièce
canvas.addEventListener("mouseup", () => {
  if (selectedPiece) {
    dropZones.forEach((dropZone, zoneIndex) => {
      if (isInDropZone(selectedPiece, dropZone)) {
        selectedPiece.x = dropZone.x;
        selectedPiece.y = dropZone.y;

        if (zoneIndex === selectedPiece.dropZone) {
          console.log(`Pièce bien placée dans la zone ${zoneIndex + 1}`);
        } else {
          console.log(`Pièce mal placée dans la zone ${zoneIndex + 1}`);
        }
      }
    });

    selectedPiece.isDragging = false; // Fin du drag
    selectedPiece = null; // Réinitialiser la pièce sélectionnée

    redrawPuzzle();

    if (checkAllPiecesPlaced()) {
      document.getElementById("message").style.display = "block";
    }
  }
});

// Écouteur de changement pour le select
select.addEventListener("change", (e) => {
  document.getElementById("message").style.display = "none";
  const selectedImageIndex = e.target.value;
  const selectedImage = images[selectedImageIndex].src;

  initializePuzzle(selectedImage); // Charger le puzzle avec l'image sélectionnée
});

// Initialiser le puzzle avec l'image par défaut
initializePuzzle(images[0].src);
