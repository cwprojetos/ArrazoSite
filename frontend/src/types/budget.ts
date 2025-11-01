// src/types/budget.ts

// Tipos principais para o sistema de orçamentos
export type EventType = "casamento" | "aniversario" | "corporativo" | "outros";

export interface BudgetService {
  id: string;
  name: string;
  selected: boolean;
  value?: number;
  image?: string;
  description?: string;
}

export interface Budget {
  id: string;
  clientName: string;
  eventDate: string;
  eventType: EventType;
  location?: string;
  guestCount: number;
  services: BudgetService[];
  pricePerPerson: number;
  additionalCosts: number;
  discount: number;
  observations?: string;
  total: number;
  createdAt: string;
}

// ✅ Serviços padrão com imagem + descrição + título completo
export const defaultServices: BudgetService[] = [
  {
    id: "buffet",
    name: "Buffet completo",
    selected: false,
    image: "/services/buffet.jpg",
    description:
      "Serviço de buffet completo incluindo montagem da mesa principal, entradas variadas, pratos quentes, guarnições, sobremesas e bebidas não alcoólicas. Equipe de garçons e copeiros inclusa para atendimento durante todo o evento.",
  },
  {
    id: "decoracao",
    name: "Decoração personalizada",
    selected: false,
    image: "/services/decoracao.jpg",
    description:
      "Projeto de decoração completo, incluindo montagem de mesa principal, arranjos florais, painel decorativo, iluminação cênica e ambientação personalizada conforme o estilo do evento. Materiais de alta qualidade e montagem executada pela equipe Arazzo.",
  },
  {
    id: "equipe",
    name: "Equipe de apoio com garçons",
    selected: false,
    image: "/services/equipe.jpg",
    description:
      "Equipe de apoio composta por garçons, copeiros e auxiliares devidamente uniformizados, responsáveis pelo atendimento aos convidados, reposição do buffet, organização das mesas e suporte geral durante o evento. Profissionais experientes e coordenados para oferecer excelência no serviço.",
  },
  {
    id: "iluminacao",
    name: "Iluminação e som",
    selected: false,
    image: "/services/iluminacao.jpg",
    description:
      "Estrutura completa de iluminação e sonorização, incluindo montagem, operação e desmontagem. Equipamentos profissionais de alta performance, adequados ao espaço do evento, garantindo qualidade sonora e ambientação luminosa perfeita durante toda a celebração.",
  },
];
