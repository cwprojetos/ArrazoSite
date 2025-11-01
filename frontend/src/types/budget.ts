export interface Budget {
  id: string;
  cliente_nome: string;
  evento_tipo: string;
  data_evento: string;
  local_evento?: string;
  convidados: number;
  total: number;
  observacoes: string; // Corrigido: sempre inicializado
  criado_em: string;   // Corrigido: obrigatório
}
