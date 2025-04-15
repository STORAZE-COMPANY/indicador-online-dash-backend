export const buildHtmlTemplateForPassword = (senha: string) => `
<div style="font-family: Arial, sans-serif; padding: 20px; color: #333; text-align: center;">
  <img src="https://indicador-online-images.s3.sa-east-1.amazonaws.com/app-logo/Logo_Indicador_Online_Selo_Preto-02.png" alt="Indicador Online" style="width: 150px; margin-bottom: 20px;" />
  <h2 style="color: #1da9d3;">Bem-vindo ao Indicador Online!</h2>
  <p style="font-size: 16px;">Sua senha de acesso é: <strong>${senha}</strong></p>
  <p style="font-size: 14px; color: #666;">Recomendamos que você troque sua senha após o primeiro acesso.</p>
  <hr style="margin: 30px 0;" />
  <p style="font-size: 12px; color: #aaa;">A melhor direção para se tornar Líder.</p>
</div>
`;
