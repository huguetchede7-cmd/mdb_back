import { QueryInterface } from "sequelize"

/**
 * Génère un slug lisible et stable
 */
function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/(^-|-$)+/g, "")
}

export async function up(queryInterface: QueryInterface) {
  const now = new Date()

  const rolesData = [
    // DASHBOARD
    {
      title: "Tableau de bord",
      description: "Accès au tableau de bord",
      icon: "LayoutDashboardIcon",
    },

    // CLIENTS
    {
      title: "Clients",
      description: "Gestion des clients",
      icon: "UsersIcon",
    },
    {
      title: "Liste des clients",
      description: "Voir tous les clients",
      icon: "UsersIcon",
    },
    {
      title: "Ajouter client",
      description: "Créer un nouveau client",
      icon: "UserPlusIcon",
    },
    {
      title: "Groupes clients",
      description: "Gestion des groupes de clients",
      icon: "UsersIcon",
    },

    // COMPTES
    {
      title: "Comptes",
      description: "Gestion des comptes clients",
      icon: "UserIcon",
    },
    {
      title: "Comptes clients",
      description: "Voir les comptes",
      icon: "UserIcon",
    },
    {
      title: "Ouvrir un compte",
      description: "Créer un nouveau compte",
      icon: "UserPlusIcon",
    },

    // ÉPARGNE
    {
      title: "Épargne",
      description: "Gestion de l’épargne",
      icon: "WalletIcon",
    },
    {
      title: "Dépôts",
      description: "Enregistrer un dépôt",
      icon: "ArrowDownCircleIcon",
    },
    {
      title: "Retraits",
      description: "Effectuer un retrait",
      icon: "ArrowUpCircleIcon",
    },

    // CRÉDITS
    {
      title: "Crédits",
      description: "Gestion des crédits",
      icon: "BanknoteIcon",
    },
    {
      title: "Demandes de crédit",
      description: "Voir les demandes",
      icon: "FileTextIcon",
    },
    {
      title: "Accorder un crédit",
      description: "Créer un crédit",
      icon: "BanknoteIcon",
    },
    {
      title: "Remboursements",
      description: "Gestion des remboursements",
      icon: "RepeatIcon",
    },

    // TRANSACTIONS
    {
      title: "Transactions",
      description: "Gestion des transactions",
      icon: "ArrowRightLeftIcon",
    },
    {
      title: "Historique transactions",
      description: "Voir toutes les transactions",
      icon: "HistoryIcon",
    },
    {
      title: "Transfert",
      description: "Effectuer un transfert",
      icon: "ArrowRightLeftIcon",
    },

    // PAIEMENTS
    {
      title: "Paiements",
      description: "Gestion des paiements",
      icon: "CreditCardIcon",
    },
    {
      title: "Paiements clients",
      description: "Paiements des clients",
      icon: "CreditCardIcon",
    },
    {
      title: "Factures",
      description: "Gestion des factures",
      icon: "FileTextIcon",
    },

    // RAPPORTS
    {
      title: "Rapports",
      description: "Statistiques et analyses",
      icon: "BarChart3Icon",
    },
    {
      title: "Rapport financier",
      description: "Analyse globale",
      icon: "BarChart3Icon",
    },
    {
      title: "Rapport crédits",
      description: "Analyse des crédits",
      icon: "BarChart3Icon",
    },
    {
      title: "Rapport épargne",
      description: "Analyse de l’épargne",
      icon: "BarChart3Icon",
    },

    // UTILISATEURS
    {
      title: "Utilisateurs",
      description: "Gestion des utilisateurs",
      icon: "SettingsIcon",
    },

    // PARAMÈTRES
    {
      title: "Paramètres",
      description: "Configuration du système",
      icon: "SettingsIcon",
    },
  ]

  for (const role of rolesData) {
    const slug = slugify(role.title)

    const exists = await queryInterface.rawSelect(
      "admin_roles",
      { where: { slug } },
      ["id"]
    )

    if (!exists) {
      await queryInterface.bulkInsert("admin_roles", [
        {
          title: role.title,
          slug,
          description: role.description,
          icon: role.icon,
          created_at: now,
          updated_at: now,
        },
      ])
    }
  }
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.bulkDelete("admin_roles", {}, {})
}