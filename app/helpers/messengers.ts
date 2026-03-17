interface MessengersError {
    transfert: {
        verification: string;
    };
    jwt: {
        requis: string;
        no_user: string;
    };
    session_general: string;
    password: {
        incorrect: string;
        non_identique: string;
        identique_a_lancien: string;
    };
    compte: {
        statut_not_found: string;
        statut_bloquer: string;
        session_expirer: string;
        statut_inactif: string;
    };
    token: {
        already_exist: string;
        invalide: string;
    };
    inconnu: string;
    email: {
        deja_utiliser: string;
        invalide: string;
        verification_impossible: string;
        aucun_compte: string;
        unverification: string;
    };

    phone: {
        deja_utiliser: string;
        invalide: string;
        aucun_compte: string;
        verification_impossible: string;
    };

    whatsapp: {
        deja_utiliser: string;
    };

    user_name: {
        deja_utiliser: string;
    };
    image: {
        type: string;
        telechargement: string;
        max_size: string;
        mimes_img: string;
        mimes_pdf: string;
        mimes_img_pdf: string;
    };
    champs: {
        requis: string;
    };
    integer: {
        "*": string;
        min: string;
        max: string;
    };
    string: {
        min: string;
        max: string;
    };
    date: {
        format: string;
    };
    general: {
        inputs: string;
        default: string;
        edition: string;
        not_found: string;
    };
    order: {
        create: string;
        not_found: string;
    };
}

interface MessengersSuccess {
    reset_password: {
        title: string;
        message_password_reset: string;
        message_password_changed: string;
    };
    email: {
        envoyer: string;
    };
    general: {
        edtion: string;
    };
}

interface Messengers {
    error: MessengersError;
    success: MessengersSuccess;
}

const Messengers: Messengers = {
    error: {
         order: {
            create: "Une erreur est survenue lors de l'enregistrement de votre commande",
            not_found: "Votre commande a déjà été payé ou est inexistant"
        },
        transfert: {
            verification: "Une erreur est survenu lors de la vérification du paiement"
        },
        jwt: {
            requis: "Token manquant ou introuvable",
            no_user: "Votre session a expiré ou est invalide"
        },
        session_general: "Veuillez patienter puis réessayer plus tard. Si le problème persiste, veuillez vous reconnecter à nouveau",
        password: {
            incorrect: "Mot de passe incorrect",
            non_identique: "Mot de passe non identique",
            identique_a_lancien: "Doit être différent de votre mot de passe actuel"
        },
        compte: {
            statut_not_found: "Votre compte est introuvable ou a été supprimer",
            statut_bloquer: "Votre compte est bloqué ou a été supprimé.",
            session_expirer: "Votre session a expirée, veuillez-vous reconnecter svp !",
            statut_inactif: "Compte inactif, veuillez confirmer votre adresse email."
        },
        token: {
            already_exist: "Un lien vous déjà été envoyé. Merci de patienter puis réessayer dans 1h",
            invalide: "Le token invalide ou a déjà expiré"
        },
        inconnu: "Un problème est survenu. Veuillez patienter puis réessayer plus tard.",
        email: {
            deja_utiliser: "Adresse e-mail déjà utilisée.",
            invalide: "Adresse e-mail invalide.",
            verification_impossible: "Une erreur est survenue lors de la vérification de cette adresse email.",
            unverification: "Merci de bien vouloir valider votre adresse email",
            aucun_compte: "Aucun compte associé à l'adresse e-mail."
        },
        phone: {
            deja_utiliser: "Téléphone déjà utilisé.",
            invalide: "Téléphone invalide.",
            aucun_compte: "Aucun compte associé à ce numéro de téléphone.",
            verification_impossible: "Une erreur est survenue lors de la vérification de votre numéro de téléphone."
        },
        whatsapp: {
            deja_utiliser: "Numéro de whatsapp déjà utilisé."
        },
        user_name: {
            deja_utiliser: "Nom d'utilisateur déjà utilisé."
        },
        image: {
            type: "Ce champs requiert un fichier image (.png, .jpg, .jpeg)",
            telechargement: "Une erreur est survenu, lors du téléchargement de l'image",
            max_size: "Image trop volumineux. Taille maximum: ",
            mimes_img: "Format non accepté. Le ficher doit être (.png, .jpg, .jpeg)",
            mimes_pdf: "Format non accepté. Le fichier doit être un document PDF",
            mimes_img_pdf: "Format non accepté. Le fichier doit être (.png, .jpg, .jpeg, .pdf)"
        },
        champs: {
            requis: "Ce champ est errorné. Veuillez bien le renseigné"
        },
        integer: {
            "*": "Doit être un nombre entier",
            min: "Doit être un nombre entier et supérieur à: ",
            max: "Doit être un nombre entier et inférieur à: "
        },
        string: {
            min: " caractère(s) au minumum",
            max: " caractère(s) au maximum"
        },
        date: {
            format: "Date invalide ou mauvais format"
        },
        general: {
            inputs: "Veuillez compléter les informations du formulaires",
            default: "Un problème est survenu, veuillez réessayer plus tard",
            edition: "Aucune modification effectuée",
            not_found: "Aucune résultat trouvé"
        }
    },
    success: {
        reset_password: {
            title: "Mot de passe réinitialisé",
            message_password_reset: "Votre mot de passe a été réinitialiser avec succès. Vous pouvez désormais vous connecter à votre compte.",
            message_password_changed: "Votre mot de passe a été mis a jour avec succès."
        },
        email: {
            envoyer: "Mail envoyé avec succès."
        },
        general: {
            edtion: "Modification effectuée avec succès"
        }
    }
};

export default Messengers;
