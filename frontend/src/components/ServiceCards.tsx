import { useNavigate } from "react-router-dom";

const ServiceCards = () => {
  const navigate = useNavigate();

  const services = [
    {
      id: "buffet",
      title: "Buffet",
      details: [
        "Montagem da mesa principal",
        "Pratos quentes e sobremesas",
        "Equipe de garçons inclusa",
        "Serviço completo do início ao fim",
      ],
      price: 500,
      color: "from-emerald-100 to-emerald-50",
      image: "/services/buffet.jpg",
    },
    {
      id: "decoracao",
      title: "Decoração",
      details: [
        "Arranjos florais e painel decorativo",
        "Iluminação cênica e personalizada",
        "Materiais de alta qualidade",
        "Montagem executada pela equipe Arazzo",
      ],
      price: 1000,
      color: "from-pink-100 to-pink-50",
      image: "/services/decoracao.jpg",
    },
    {
      id: "equipe",
      title: "Equipe de Apoio",
      details: [
        "Garçons e auxiliares uniformizados",
        "Atendimento aos convidados",
        "Reposição e organização das mesas",
        "Suporte total durante o evento",
      ],
      price: 1500,
      color: "from-indigo-100 to-indigo-50",
      image: "/services/equipe.jpg",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
      {services.map((service) => (
        <div
          key={service.id}
          onClick={() => navigate(`/novo-orcamento?servico=${service.id}`)}
          className={`cursor-pointer p-6 rounded-2xl shadow-md bg-gradient-to-b ${service.color} hover:scale-105 transition-transform`}
        >
          {service.image && (
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-40 object-cover rounded-xl mb-3"
            />
          )}
          <h2 className="text-2xl font-bold text-center mb-3">{service.title}</h2>
          <ul className="text-sm text-gray-700 mb-4 list-disc list-inside space-y-1">
            {service.details.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
          <div className="bg-emerald-600 text-white text-center py-2 rounded-full font-semibold text-lg">
            R$ {service.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceCards;
