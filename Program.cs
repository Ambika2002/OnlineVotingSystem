
using OnlineVotingSystem.CandidateRepository;
using OnlineVotingSystem.ElectionRepository;
using OnlineVotingSystem.ElectionResultRepsitory;
using OnlineVotingSystem.VoterInfoRepository;
using OnlineVotingSystem.VoterRepository;
using OnlineVotingSystem.AdminRepository;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Serilog;
using OnlineVotingSystem.ElectionCandidatesRepository;

namespace OnlineVotingSystem
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            Log.Logger = new LoggerConfiguration()
             .ReadFrom.Configuration(builder.Configuration)
             .Enrich.FromLogContext()
             .WriteTo.Console()
             .WriteTo.File("logs/SystemLog.txt")
             .CreateLogger();

            builder.Host.UseSerilog();


            // Add services to the container.

            builder.Services.AddControllers();
            builder.Services.AddTransient<IAdminOpt, AdminOperations>();
            builder.Services.AddTransient<IVoterInfoOpt, VoterInfoOpt>();
            builder.Services.AddTransient<IVoterOpt, VoterOpt>();
            builder.Services.AddTransient<ICandidateOpt, CandidateOpt>();
            builder.Services.AddTransient<IElectionOpt, ElectionOpt>();
            builder.Services.AddTransient<IElectionResultOpt, ElectionResultOpt>();
            builder.Services.AddTransient<IElectionCandidateOpt, ElectionCandidatesOpt>();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();


            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options => {
                options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = builder.Configuration["Jwt:Issuer"],
                    ValidAudience = builder.Configuration["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
                };
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            app.UseCors(x => x.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
