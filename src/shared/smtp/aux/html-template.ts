const indicadorOnlineLogo =
  "https://indicador-online-images.s3.sa-east-1.amazonaws.com/app-logo/Logo_Indicador_Online_Selo_Preto-02.png";
export const buildHtmlTemplateForPassword = (senha: string) => `
<div style="font-family: Arial, sans-serif; padding: 20px; color: #333; text-align: center;">
  <img src=${indicadorOnlineLogo} />
  <h2 style="color: #1da9d3;">Bem-vindo ao Indicador Online!</h2>
  <p style="font-size: 16px;">Sua senha de acesso é: <strong>${senha}</strong></p>
  <p style="font-size: 14px; color: #666;">Recomendamos que você troque sua senha após o primeiro acesso.</p>
  <hr style="margin: 30px 0;" />
  <p style="font-size: 12px; color: #aaa;">A melhor direção para se tornar Líder.</p>
</div>
`;

export const buildHtmlTemplateForAnomalyAlert = ({
  anomaly,
  questionRelatedToAnomaly,
}: {
  questionRelatedToAnomaly: string;
  anomaly: string;
}) => `
<div style="font-family: Arial, sans-serif; padding: 20px; color: #333; text-align: center;">
  <img src=${indicadorOnlineLogo} alt="Indicador Online" style="width: 150px; margin-bottom: 20px;" />
  <h2 style="color: #d9534f;">⚠️ Alerta de Anomalia</h2>
  <p style="font-size: 16px;">
    Detectamos uma anomalia na sua resposta à seguinte pergunta:
  </p>
  <blockquote style="font-size: 16px; font-style: italic; color: #555; margin: 20px auto; max-width: 500px;">
    "${questionRelatedToAnomaly}"
  </blockquote>
    <p style="font-size: 16px;">
    Anomalia:
  </p>
  <blockquote style="font-size: 16px; font-style: italic; color: #555; margin: 20px auto; max-width: 500px;">
    "${anomaly}"
  </blockquote>
  <p style="font-size: 14px; color: #666;">
    Recomendamos revisar sua resposta e, se necessário, entrar em contato com o suporte.
  </p>
  <hr style="margin: 30px 0;" />
  <p style="font-size: 12px; color: #aaa;">A melhor direção para se tornar Líder.</p>
</div>
`;
export const buildResolutionAlertHtml = ({
  employeeName,
  questionRelatedToAnomaly,
}: {
  employeeName: string;
  questionRelatedToAnomaly: string;
}) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; text-align: center;">
    <img src=${indicadorOnlineLogo} alt="Indicador Online" style="width: 150px; margin-bottom: 20px;" />
    
    <h2 style="color: #1da9d3;">Resolução de Anomalia Registrada</h2>
    
    <p style="font-size: 16px;">
      O funcionário <strong>${employeeName}</strong> registrou uma resolução para a seguinte anomalia:
    </p>
    
    <blockquote style="font-size: 16px; font-style: italic; color: #555; margin: 20px auto; max-width: 500px;">
      "${questionRelatedToAnomaly}"
    </blockquote>
    
    <p style="font-size: 14px; color: #666;">
      Por favor, revise a resolução e valide se está de acordo com os padrões da empresa.
    </p>
    
    <hr style="margin: 30px 0;" />
    
    <p style="font-size: 12px; color: #aaa;">A melhor direção para se tornar Líder.</p>
  </div>
`;
