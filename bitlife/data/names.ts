import type { NamePool } from '@bl/sim';

export const names: Record<string, NamePool> = {
  fr: {
    m: ['Lucas', 'Hugo', 'Louis', 'Gabriel', 'Arthur', 'Jules', 'Adam', 'Raphaël', 'Léo', 'Nathan', 'Mathis', 'Noah', 'Tom', 'Théo', 'Sacha', 'Mohamed', 'Yanis', 'Paul', 'Maxime', 'Antoine', 'Thomas', 'Nicolas', 'Julien', 'Kévin', 'Baptiste', 'Clément', 'Victor', 'Samuel', 'Ethan', 'Malo', 'Rayan', 'Bastien', 'Balthazar'],
    f: ['Emma', 'Jade', 'Louise', 'Alice', 'Chloé', 'Léa', 'Manon', 'Inès', 'Lina', 'Rose', 'Anna', 'Camille', 'Zoé', 'Juliette', 'Sarah', 'Lola', 'Clara', 'Margaux', 'Léna', 'Ambre', 'Charlotte', 'Mathilde', 'Pauline', 'Océane', 'Yasmine', 'Agathe', 'Nina', 'Romane', 'Élise', 'Maëlys', 'Salomé', 'Capucine'],
    last: ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau', 'Simon', 'Laurent', 'Lefebvre', 'Michel', 'Garcia', 'David', 'Bertrand', 'Roux', 'Vincent', 'Fournier', 'Morel', 'Girard', 'André', 'Mercier', 'Dupont', 'Lambert', 'Bonnet', 'François', 'Martinez', 'Benali', 'Nguyen', 'Diallo', 'Chevalier', 'Faure', 'Rousseau'],
  },
  be: {
    m: ['Arthur', 'Noah', 'Louis', 'Jules', 'Adam', 'Victor', 'Liam', 'Gabriel', 'Lucas', 'Nathan', 'Mathis', 'Hugo', 'Achille', 'Basile', 'Simon', 'Maxime', 'Thibault', 'Quentin', 'Cédric', 'Wout', 'Lars', 'Mehdi', 'Romain', 'Jonas'],
    f: ['Olivia', 'Emma', 'Louise', 'Alice', 'Mila', 'Léa', 'Juliette', 'Lina', 'Elena', 'Chloé', 'Zoé', 'Marie', 'Charlotte', 'Camille', 'Margaux', 'Noémie', 'Amélie', 'Justine', 'Lotte', 'Fien', 'Sofia', 'Inès', 'Manon', 'Clémence'],
    last: ['Peeters', 'Janssens', 'Maes', 'Jacobs', 'Mertens', 'Willems', 'Claes', 'Goossens', 'Wouters', 'De Smet', 'Dubois', 'Lambert', 'Dupont', 'Martin', 'Leclercq', 'Lejeune', 'Renard', 'Vandenberghe', 'Simon', 'Hermans', 'Lemaire', 'Michiels', 'Collard', 'El Amrani'],
  },
  us: {
    m: ['Liam', 'Noah', 'Oliver', 'James', 'Elijah', 'William', 'Henry', 'Lucas', 'Benjamin', 'Theodore', 'Mason', 'Logan', 'Ethan', 'Jacob', 'Michael', 'Daniel', 'Jackson', 'Sebastian', 'Aiden', 'Mateo', 'Carter', 'Wyatt', 'Jayden', 'Tyler', 'Brandon', 'Kevin', 'Marcus', 'DeShawn', 'Diego', 'Kyle'],
    f: ['Olivia', 'Emma', 'Charlotte', 'Amelia', 'Sophia', 'Mia', 'Isabella', 'Ava', 'Evelyn', 'Luna', 'Harper', 'Sofia', 'Camila', 'Eleanor', 'Elizabeth', 'Violet', 'Scarlett', 'Emily', 'Hazel', 'Madison', 'Ashley', 'Brittany', 'Jasmine', 'Kayla', 'Aaliyah', 'Megan', 'Taylor', 'Riley', 'Chloe', 'Zoey'],
    last: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Nguyen', 'Kim'],
  },
  uk: {
    m: ['Oliver', 'George', 'Harry', 'Noah', 'Jack', 'Leo', 'Arthur', 'Muhammad', 'Oscar', 'Charlie', 'Jacob', 'Thomas', 'Henry', 'William', 'Alfie', 'Theo', 'Freddie', 'Archie', 'Joshua', 'James', 'Callum', 'Rhys', 'Kieran', 'Liam', 'Ewan', 'Finlay'],
    f: ['Olivia', 'Amelia', 'Isla', 'Ava', 'Mia', 'Ivy', 'Lily', 'Isabella', 'Rosie', 'Sophia', 'Grace', 'Freya', 'Poppy', 'Evie', 'Florence', 'Willow', 'Daisy', 'Phoebe', 'Charlotte', 'Emily', 'Chloe', 'Megan', 'Bethany', 'Holly', 'Imogen', 'Niamh'],
    last: ['Smith', 'Jones', 'Taylor', 'Brown', 'Williams', 'Wilson', 'Johnson', 'Davies', 'Robinson', 'Wright', 'Thompson', 'Evans', 'Walker', 'White', 'Roberts', 'Green', 'Hall', 'Wood', 'Jackson', 'Clarke', 'Patel', 'Khan', 'Murphy', 'Campbell', 'MacDonald', 'Hughes', 'Edwards'],
  },
  ca: {
    m: ['Liam', 'Noah', 'William', 'Thomas', 'Benjamin', 'Lucas', 'Jacob', 'Logan', 'Félix', 'Nathan', 'Samuel', 'Olivier', 'Xavier', 'Ethan', 'Owen', 'Jack', 'Émile', 'Léo', 'Alexis', 'Gabriel', 'Raphaël', 'Mathis', 'Connor', 'Wyatt'],
    f: ['Olivia', 'Emma', 'Charlotte', 'Alice', 'Florence', 'Léa', 'Ava', 'Chloé', 'Zoé', 'Rosalie', 'Béatrice', 'Amelia', 'Sophie', 'Maëlle', 'Juliette', 'Emily', 'Hannah', 'Mia', 'Abigail', 'Camille', 'Évelyne', 'Laurence', 'Maya', 'Madison'],
    last: ['Tremblay', 'Gagnon', 'Roy', 'Côté', 'Bouchard', 'Gauthier', 'Morin', 'Lavoie', 'Fortin', 'Gagné', 'Smith', 'Brown', 'Wilson', 'MacDonald', 'Martin', 'Campbell', 'Anderson', 'Lee', 'Wong', 'Singh', 'Pelletier', 'Bélanger', 'Lévesque', 'Thompson'],
  },
  jp: {
    m: ['Haruto', 'Sota', 'Yuto', 'Riku', 'Hinata', 'Minato', 'Ren', 'Yamato', 'Takumi', 'Kaito', 'Daiki', 'Kenta', 'Shota', 'Takeshi', 'Hiroshi', 'Kenji', 'Yuki', 'Akira', 'Sora', 'Haruki', 'Itsuki', 'Ryota'],
    f: ['Himari', 'Yui', 'Mei', 'Aoi', 'Sakura', 'Rin', 'Hina', 'Yuna', 'Akari', 'Mio', 'Haruka', 'Misaki', 'Nanami', 'Yuka', 'Ayaka', 'Emi', 'Kaori', 'Naomi', 'Hana', 'Rina', 'Mai', 'Koharu'],
    last: ['Sato', 'Suzuki', 'Takahashi', 'Tanaka', 'Watanabe', 'Ito', 'Yamamoto', 'Nakamura', 'Kobayashi', 'Kato', 'Yoshida', 'Yamada', 'Sasaki', 'Yamaguchi', 'Matsumoto', 'Inoue', 'Kimura', 'Hayashi', 'Shimizu', 'Mori', 'Ikeda', 'Hashimoto'],
  },
};
