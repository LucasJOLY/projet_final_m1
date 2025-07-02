import React from 'react';
import type { Client } from './types';
import { FaBuilding, FaUser } from 'react-icons/fa';

/**
 * Retourne le nom d'affichage d'un client selon son type
 * - Entreprise: "Nom de l'entreprise"
 * - Personne: "Nom Prénom"
 */
export const getClientDisplayName = (client: Client): string => {
  if (client.is_company) {
    // Pour une entreprise, afficher le nom de l'entreprise
    return client.name || client.contact_name;
  } else {
    // Pour une personne, afficher "Prénom Nom"
    const firstName = client.contact_first_name || '';
    const lastName = client.contact_name || '';
    return `${firstName} ${lastName}`.trim();
  }
};

export const getClientTypeIcon = (client: Client): React.ReactNode => {
  console.log('client', client.is_company);
  return client.is_company ? <FaBuilding /> : <FaUser />;
};

/**
 * Retourne le nom complet d'affichage d'un client avec le nom de contact
 * - Entreprise: "Nom de l'entreprise : Nom du contact"
 * - Personne: "Prénom Nom"
 */
export const getClientFullDisplayName = (client: Client): string => {
  if (client.is_company) {
    // Pour une entreprise, afficher "Nom entreprise : Contact"
    const companyName = client.name || '';
    const contactName = client.contact_name || '';
    const contactFirstName = client.contact_first_name || '';
    const fullContactName = `${contactFirstName} ${contactName}`.trim();

    if (companyName && fullContactName) {
      return `${companyName} : ${fullContactName}`;
    } else if (companyName) {
      return companyName;
    } else {
      return fullContactName;
    }
  } else {
    // Pour une personne, même chose que getClientDisplayName
    return getClientDisplayName(client);
  }
};

/**
 * Retourne le type d'un client en format lisible
 */
export const getClientTypeLabel = (isCompany: boolean): string => {
  return isCompany ? 'clients.view.company' : 'clients.view.person';
};
