var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// BMI Calculator API endpoint
app.MapPost("bmicalc/calculate", (BmiInput input) =>
{
    double bmi;
    double heightMeters;
    double weightKg;

    if (input.System == "metric")
    {
        heightMeters = input.HeightCm / 100.0;
        weightKg = input.WeightKg;
    }
    else
    {
        // imperial: height in feet, weight in pounds
        heightMeters = input.HeightFeet * 0.3048;
        weightKg = input.WeightLb * 0.45359237;
    }

    bmi = weightKg / (heightMeters * heightMeters);

    string category;
    string description;

    if (bmi < 18.5)
    {
        category = "Underweight";
        description = "Below healthy weight";
    }
    else if (bmi < 25)
    {
        category = "Normal";
        description = "Healthy weight";
    }
    else if (bmi < 30)
    {
        category = "Overweight";
        description = "Above healthy weight";
    }
    else
    {
        category = "Obese";
        description = "Above healthy weight";
    }

    return Results.Ok(new BmiResult
    {
        Bmi = Math.Round(bmi, 1),
        HeightMeters = Math.Round(heightMeters, 2),
        WeightKg = Math.Round(weightKg, 1),
        Category = category,
        Description = description
    });
});

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}

public class BmiInput
{
    public string System { get; set; } = "";
    public double HeightCm { get; set; }
    public double HeightFeet { get; set; }
    public double WeightKg { get; set; }
    public double WeightLb { get; set; }
}

public class BmiResult
{
    public double Bmi { get; set; }
    public double HeightMeters { get; set; }
    public double WeightKg { get; set; }
    public string Category { get; set; } = "";
    public string Description { get; set; } = "";
}